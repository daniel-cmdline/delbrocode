"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function HeroSectionOne() {
  const { isSignedIn, isLoaded } = useUser();

  // Don't render until Clerk is loaded to prevent hydration issues
  if (!isLoaded) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/20 dark:bg-neutral-800/20">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/20 dark:bg-neutral-800/20">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/20 dark:bg-neutral-800/20">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.2,
          }}
          className="relative z-10 mb-6"
        >
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-gray-800 to-black px-4 py-2 text-sm font-medium text-white shadow-lg border border-gray-600">
            Introducing Del's Bro Coding
          </span>
        </motion.div>
        
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-white md:text-4xl lg:text-7xl">
          {"Master coding with real-time execution"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-gray-300"
        >
          Practice bro coding with del. 
          Join thousands of developers improving their skills on del'sBroCodePlatform.
        </motion.p>
        
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {isSignedIn ? (
            <Link href="/problems">
              <button className="w-60 transform rounded-lg bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200">
                Go to Problems
              </button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <button className="w-60 transform rounded-lg bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200">
                Get Started
              </button>
            </Link>
          )}
        </motion.div>
        
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200/20 bg-neutral-900/50 p-4 shadow-md backdrop-blur-sm max-w-7xl mx-auto"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300/20">
            <img
              src="https://assets.aceternity.com/pro/aceternity-landing.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover max-h-[700px]"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 