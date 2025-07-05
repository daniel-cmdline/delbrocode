import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export const judge0Client = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(JUDGE0_API_KEY && { 'X-RapidAPI-Key': JUDGE0_API_KEY })
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
  const response = await judge0Client.post('/submissions', {
    source_code: code,
    language_id: LANGUAGE_IDS[language],
    stdin: input || '',
    wait: true
  });

  return response.data.token;
}

export async function getSubmissionResult(token: string): Promise<ExecutionResult> {
  const response = await judge0Client.get(`/submissions/${token}`);
  return response.data;
}