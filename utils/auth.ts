// utils/auth.ts
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse, serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET as string

interface Payload {
  id: string
  email: string
  role: string
}

// ─────────────────────────────────────────────
// Estrae il payload dal cookie 'auth' della richiesta
// ─────────────────────────────────────────────
export function getPayloadFromReq(req: NextApiRequest | { headers: any }): Payload | null {
  try {
    const cookieHeader = req.headers?.cookie
    if (!cookieHeader) return null

    const parsed = parse(cookieHeader)
    const token = parsed.auth
    if (!token) return null

    const payload = jwt.verify(token, JWT_SECRET)
    return payload as Payload
  } catch (err) {
    console.error('[auth] getPayloadFromReq error:', err)
    return null
  }
}

// ─────────────────────────────────────────────
// Imposta il cookie con il token JWT (login session)
// ─────────────────────────────────────────────
export async function setLoginSession(res: NextApiResponse, payload: Payload) {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })

  const cookie = serialize('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 giorni
  })

  res.setHeader('Set-Cookie', cookie)
}


// ─────────────────────────────────────────────
// Middleware generico per autorizzare per ruolo
// ─────────────────────────────────────────────
export function authorizeRole(
  role: string,
  handler: (req: NextApiRequest, res: NextApiResponse) => any
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const payload = getPayloadFromReq(req)
    if (!payload || payload.role?.toUpperCase() !== role.toUpperCase()) {
      return res.status(403).json({ message: `Accesso negato: solo ${role}` })
    }
    return handler(req, res)
  }
}
