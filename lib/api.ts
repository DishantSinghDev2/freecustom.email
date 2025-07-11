
import { verify } from '@/lib/jwt'

const API_KEY = process.env.RAPIDAPI_KEY || ''
const API_HOST = process.env.RAPIDAPI_URL || ''

export async function fetchFromAPI(path: string, method: string = 'GET') {
  const response = await fetch(`https://${API_HOST}${path}`, {
    method,
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
    },
  })
  return response.json()
}

export async function authenticateRequest(request: Request) {
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