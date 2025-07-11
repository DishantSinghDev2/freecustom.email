'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { AppHeader } from '@/components/app-header'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className=" bg-background text-foreground flex flex-col items-center justify-center px-4">
        <AppHeader />
        <div className="max-w-md flex flex-col h-[80vh] items-center justify-center mt-10">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-base mb-6 text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again or go back home.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2 rounded-md bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
