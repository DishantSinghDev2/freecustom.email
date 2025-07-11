// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDirectory = path.join(process.cwd(), 'public/blog')

export function getAllPostSlugs() {
  return fs.readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace('.md', ''))
}

export async function getPostBySlug(slug: string) {
    const res = await fetch(`http://localhost:3000/blog/${slug}.md`) // if in public/blog/
    const fileContent = await res.text()
  
    const { data, content } = matter(fileContent)
    return { data, content }
  }
  