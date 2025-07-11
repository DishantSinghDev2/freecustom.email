import { JWTPayload, SignJWT, jwtVerify, errors } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')

export async function sign(payload: JWTPayload | undefined): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 // 1 hour expiration

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(secret)
}

export async function verify(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      throw new Error('JWTExpired: Token has expired')
    }
    throw error
  }
}