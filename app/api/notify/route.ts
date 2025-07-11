import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body as {email: string}

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const res = await fetch('https://ditmail.dishis.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const text = await res.text()

    if (!res.ok) {
      return NextResponse.json({ error: text }, { status: res.status })
    }

    return NextResponse.json({ message: text }, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
