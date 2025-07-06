'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue to CodeSprint</p>
        </div>
        
        <div className="flex justify-center">
          <SignIn />
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 