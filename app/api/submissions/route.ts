import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { executeCode, getSubmissionResult } from '@/lib/judge0/client';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId, code, language } = await request.json();

    // Get problem and test cases
    const { data: problem } = await supabaseServer
      .from('problems')
      .select('*')
      .eq('id', problemId)
      .single();

    const { data: testCases } = await supabaseServer
      .from('test_cases')
      .select('*')
      .eq('problem_id', problemId);

    if (!problem || !testCases) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Create submission record
    const { data: submission } = await supabaseServer
      .from('submissions')
      .insert({
        user_id: userId,
        problem_id: problemId,
        code,
        language,
        status: 'Pending'
      })
      .select()
      .single();

    // Execute code against test cases
    let allPassed = true;
    let totalTime = 0;
    let maxMemory = 0;
    let errorMessage = '';

    for (const testCase of testCases) {
      try {
        const token = await executeCode(code, language, testCase.input);
        let result = await getSubmissionResult(token);
        
        // Poll for result
        let attempts = 0;
        while (result.status.id <= 2 && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          result = await getSubmissionResult(token);
          attempts++;
        }

        if (result.status.id !== 3) { // Not accepted
          allPassed = false;
          errorMessage = result.stderr || result.compile_output || 'Runtime error';
          break;
        }

        if (result.stdout?.trim() !== testCase.expected_output.trim()) {
          allPassed = false;
          errorMessage = 'Wrong Answer';
          break;
        }

        totalTime += parseFloat(result.time || '0');
        maxMemory = Math.max(maxMemory, result.memory || 0);

      } catch {
        allPassed = false;
        errorMessage = 'Execution failed';
        break;
      }
    }

    // Update submission
    const status = allPassed ? 'Accepted' : 'Wrong Answer';
    await supabaseServer
      .from('submissions')
      .update({
        status,
        runtime: Math.round(totalTime * 1000),
        memory_usage: maxMemory,
        error_message: errorMessage || null
      })
      .eq('id', submission.id);

    // Update user progress
    await supabaseServer
      .from('user_progress')
      .upsert({
        user_id: userId,
        problem_id: problemId,
        status: allPassed ? 'Solved' : 'Attempted',
        attempts: 1,
        last_attempt_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,problem_id'
      });

    return NextResponse.json({
      submissionId: submission.id,
      status,
      runtime: Math.round(totalTime * 1000),
      memory: maxMemory,
      error: errorMessage || null
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}