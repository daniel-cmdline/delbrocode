import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  request: NextRequest,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs
    };
    return { success: true, remaining: limit - 1 };
  }
  
  if (store[ip].count >= limit) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: store[ip].resetTime
    };
  }
  
  store[ip].count++;
  return { 
    success: true, 
    remaining: limit - store[ip].count 
  };
}