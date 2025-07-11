"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu as MenuIconLucide } from "lucide-react" // Renamed to avoid conflict if you ever use a Menu component
import Link from "next/link"
import { FaGithub, FaPatreon } from "react-icons/fa"
import { useState, useCallback } from "react" // Added useCallback
import Image from "next/image"

export function AppHeader() {
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const toggleMobileMenu = useCallback(() => {
    setMenuOpen((prev) => !prev)
  }, [])

  // Optional: Close mobile menu when a link is clicked
  const handleMobileLinkClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    // Consider w-full instead of max-w-[100vw] if container handles max width
    <header className="border-b w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home" onClick={menuOpen ? handleMobileLinkClick : undefined}>
            <Image
              src="/logo.webp" // Ensure this path is correct in your public folder
              alt="FreeCustom.Email Logo" // Slightly more descriptive alt
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10" // These sizes are fine
              priority={false} // Correct for non-LCP images
            />
          <span className="text-base sm:text-lg md:text-xl font-bold whitespace-nowrap">
            FreeCustom.Email
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="text-sm px-4 py-2" asChild>
            <a
              href="https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap"
              aria-label="View API documentation"
            >
              API
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-2"
            asChild
          >
            <a
              href="https://www.patreon.com/maildrop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Patreon"
            >
              <FaPatreon className="h-5 w-5" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme} // Use useCallback version
            className="p-2"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Menu Toggle & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme} // Use useCallback version
            className="p-2"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu} // Use useCallback version
            className="p-2"
            aria-label={menuOpen ? "Close mobile menu" : "Open mobile menu"} // Dynamic aria-label
            aria-expanded={menuOpen} // Indicate expanded state
            // aria-controls="mobile-menu-dropdown" // If dropdown had an id
          >
            <MenuIconLucide className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        // id="mobile-menu-dropdown" // For aria-controls
        <nav // Using nav for semantic navigation links
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3 bg-background border-t"
        >
          <Link href="/docs" className="text-sm hover:underline py-1" aria-label="View Pricing" onClick={handleMobileLinkClick}>
            API - Docs
          </Link>
          <a
            href="https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline py-1"
            aria-label="View API documentation"
            onClick={handleMobileLinkClick}
          >
            API
          </a>
          <a
            href="https://github.com/DishIs/temp-mail"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline flex items-center gap-1 py-1"
            aria-label="View GitHub repository"
            onClick={handleMobileLinkClick}
          >
            <FaGithub className="h-4 w-4" /> GitHub
          </a>
          <a
            href="https://www.patreon.com/maildrop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline flex items-center gap-1 py-1"
            aria-label="View Patreon"
            onClick={handleMobileLinkClick}
          >
            <FaPatreon className="h-4 w-4" /> Patreon
          </a>

        </nav>
      )}
    </header>
  )
}