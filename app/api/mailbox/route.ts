import { NextResponse } from 'next/server'
import { authenticateRequest, fetchFromAPI } from '@/lib/api'

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

