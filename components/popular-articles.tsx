import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
}

export function PopularArticles() {
  const blogDir = path.join(process.cwd(), 'public/blog')
  const files = fs.readdirSync(blogDir)

  const posts: BlogPost[] = files
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(blogDir, filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)
      return {
        slug: filename.replace('.md', ''),
        title: data.title,
        description: data.description || '',
        date: data.date,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  return (
    <section className="my-12">
      <h2 className="mb-8 text-center text-3xl font-bold">Popular Articles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 shadow-sm">
            <Link href={`/blog/${post.slug}`}>
              <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{post.description}</p>
            <p className="mt-2 text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

