import { NextResponse } from 'next/server'
import { sign } from '@/lib/jwt'

export async function POST() {
  try {
    const token = await sign({ authorized: true })
    return NextResponse.json({ token })
  } catch (error) {
    console.error('Failed to generate token:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

