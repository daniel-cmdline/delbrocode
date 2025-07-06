import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Join CodeSprint</h1>
          <p className="text-gray-400">Create your account to get started</p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none bg-transparent",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                formButtonPrimary: "bg-white text-black hover:bg-gray-200",
                formFieldInput: "bg-gray-800 border-gray-700 text-white",
                formFieldLabel: "text-gray-300",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                formResendCodeLink: "text-blue-400 hover:text-blue-300",
                identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
                formFieldAction: "text-blue-400 hover:text-blue-300",
                footerAction: "text-gray-400",
              }
            }}
          />
        </div>
        
        <div className="text-center mt-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 