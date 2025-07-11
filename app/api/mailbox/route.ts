import { NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'

const API_KEY = process.env.RAPIDAPI_KEY || ''
const API_HOST = process.env.RAPIDAPI_URL || ''

async function fetchFromAPI(path: string, method: string = 'GET') {
  const response = await fetch(`https://${API_HOST}${path}`, {
    method,
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
    },
  })
  return response.json()
}

async function authenticateRequest(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1]
  if (!token) {
    return false
  }
  try {
    await verify(token)
    return true
  } catch (error) {
    if (error instanceof Error && error.message === 'JWTExpired: Token has expired') {
      console.error('Token has expired:', error)
    } else {
      console.error('Failed to verify token:', error)
    }
    return false
  }
}

export async function GET(request: Request) {
  if (!await authenticateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const mailbox = searchParams.get('mailbox')
  const messageId = searchParams.get('messageId')

  if (!mailbox) {
    return NextResponse.json({ error: 'Mailbox parameter is required' }, { status: 400 })
  }

  try {
    if (messageId) {
      const data = await fetchFromAPI(`/mailbox/${mailbox}/message/${messageId}`)
      return NextResponse.json(data)
    } else {
      const data = await fetchFromAPI(`/mailbox/${mailbox}`)
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('API request failed:', error)
    return NextResponse.json({ error: 'Failed to fetch data from the API' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!await authenticateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const mailbox = searchParams.get('mailbox')
  const messageId = searchParams.get('messageId')

  if (!mailbox || !messageId) {
    return NextResponse.json({ error: 'Mailbox and messageId parameters are required' }, { status: 400 })
  }

  try {
    const data = await fetchFromAPI(`/mailbox/${mailbox}/message/${messageId}`, 'DELETE')
    return NextResponse.json(data)
  } catch (error) {
    console.error('API request failed:', error)
    return NextResponse.json({ error: 'Failed to delete the message' }, { status: 500 })
  }
}

