'use client'

import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { AppHeader } from '@/components/app-header'

export default function NotFound() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="bg-background text-foreground flex flex-col items-center justify-center px-4">
        <AppHeader />
        <div className="max-w-md flex flex-col h-[80vh] items-center justify-center text-center mt-10">
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            Sorry, the page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2 rounded-md bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </ThemeProvider>
  )
}
