// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

interface JwtPayload {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: `Metodo ${req.method} non consentito` })
  }

  // Disabilita il caching
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  // Legge i cookie dalla request
  const cookies = parse(req.headers.cookie || '')
  // ATTENZIONE: il login.ts serializza il token nel cookie 'auth'
  const token = cookies.auth
  if (!token) {
    return res.status(401).json({ message: 'Non autenticato' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error('[me] JWT_SECRET non configurato')
    return res.status(500).json({ message: 'Errore interno' })
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' })
    }

    return res.status(200).json({
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (err: any) {
    console.error('[me] Errore verify token:', err)
    return res.status(401).json({ message: 'Token non valido o scaduto' })
  }
}
