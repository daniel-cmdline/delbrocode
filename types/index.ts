export interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    constraints: string;
    sample_input: string;
    sample_output: string;
    time_limit: number;
    memory_limit: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface TestCase {
    id: string;
    problem_id: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
    time_limit: number;
    memory_limit: number;
  }
  
  export interface Submission {
    id: string;
    user_id: string;
    problem_id: string;
    code: string;
    language: string;
    status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
    runtime?: number;
    memory_usage?: number;
    error_message?: string;
    judge0_token?: string;
    submitted_at: string;
  }
  
  export interface UserProgress {
    id: string;
    user_id: string;
    problem_id: string;
    status: 'Attempted' | 'Solved';
    attempts: number;
    last_attempt_at: string;
  }
  
  export interface LanguageConfig {
    id: number;
    name: string;
    extension: string;
    template: string;
  }