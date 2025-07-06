'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, User, Code } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <nav className="border-b border-neutral-200/20 bg-gradient-to-r from-gray-900 via-black to-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/95">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="CodeSprint Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-white">CodeSprint</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  pathname === '/' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link 
                href="/problems" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  pathname.startsWith('/problems') 
                    ? 'bg-gray-800 text-white' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                <Code className="h-4 w-4 mr-2" />
                Problems
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-neutral-200/20 bg-gradient-to-r from-gray-900 via-black to-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/95">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="CodeSprint Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <span className="font-bold text-xl text-white">CodeSprint</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                pathname === '/' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link 
              href="/problems" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                pathname.startsWith('/problems') 
                  ? 'bg-gray-800 text-white' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              <Code className="h-4 w-4 mr-2" />
              Problems
            </Link>
          </div>

          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" className="text-white hover:text-gray-200 hover:bg-white/10">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 