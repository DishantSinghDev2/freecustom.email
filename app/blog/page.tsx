import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { AppHeader } from '@/components/app-header'

interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt?: string
}

export default function BlogPage() {
  const blogDir = path.join(process.cwd(), 'public/blog')
  const files = fs.readdirSync(blogDir)

  const posts: BlogPost[] = files
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(blogDir, filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      return {
        slug: filename.replace('.md', ''),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || content.slice(0, 120).replace(/\n/g, '') + '...',
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen max-w-[100vw] bg-background">
            <AppHeader />
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
        Blog Posts
      </h1>
      <ul className="space-y-6">
        {posts.map(post => (
          <li
            key={post.slug}
            className="bg-white/70 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150 p-5 flex flex-col gap-2"
          >
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-lg sm:text-xl font-semibold group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            <p className="text-sm text-gray-700 line-clamp-2">{post.excerpt}</p>
            <div className="mt-2">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors underline underline-offset-2"
                aria-label={`Read more about ${post.title}`}
              >
                Read more →
              </Link>
               </div>
          </li>
        ))}
      </ul>
    </div>
          </div>
    </ThemeProvider>
    )
}