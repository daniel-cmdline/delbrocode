import axios from 'axios';

const JUDGE0_API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

if (!JUDGE0_API_URL || !JUDGE0_API_KEY) {
  throw new Error('Judge0 API environment variables are not configured.');
}

export const judge0Client = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': JUDGE0_API_KEY,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  }
});

export const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54
};

export interface ExecutionResult {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

export async function executeCode(
  code: string,
  language: keyof typeof LANGUAGE_IDS,
  input?: string
): Promise<string> {
  try {
    const response = await judge0Client.post('/submissions', {
      source_code: code,
      language_id: LANGUAGE_IDS[language],
      stdin: input || '',
      wait: false  // Don't wait, we'll poll for results
    });

    return response.data.token;
  } catch (error) {
    console.error('Judge0 submission error:', error);
    throw error;
  }
}

export async function getSubmissionResult(token: string): Promise<ExecutionResult> {
  try {
    const response = await judge0Client.get(`/submissions/${token}?base64_encoded=false&fields=*`);
    return response.data;
  } catch (error) {
    console.error('Judge0 get result error:', error);
    throw error;
  }
}