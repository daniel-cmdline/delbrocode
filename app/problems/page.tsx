import { supabaseServer } from '@/lib/supabase/server';
import { ProblemList } from '@/components/problem-list/ProblemList';
import { auth } from '@clerk/nextjs/server';

export default async function ProblemsPage() {
  const { userId } = await auth();
  
  let problems = [];
  let userProgress = {};
  let bookmarks: string[] = [];

  try {
    const { data: problemsData } = await supabaseServer
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });
    
    problems = problemsData || [];

    if (userId) {
      const { data: progressData } = await supabaseServer
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', userId);

      const { data: bookmarkData } = await supabaseServer
        .from('bookmarks')
        .select('problem_id')
        .eq('user_id', userId);

      userProgress = progressData?.reduce((acc, p) => ({
        ...acc,
        [p.problem_id]: p.status
      }), {}) || {};

      bookmarks = bookmarkData?.map(b => b.problem_id) || [];
    }
  } catch (error) {
    console.error('Error fetching problems:', error);
    problems = [];
    userProgress = {};
    bookmarks = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full px-6 py-12">
        <h1 className="text-2xl font-semibold mb-2 text-neutral-100">Problems</h1>
        <p className="text-neutral-400 mb-8 text-base">Sharpen your skills by solving coding problems.</p>
        <ProblemList 
          problems={problems || []}
          userProgress={userProgress}
          bookmarks={bookmarks}
        />
      </div>
    </div>
  );
}