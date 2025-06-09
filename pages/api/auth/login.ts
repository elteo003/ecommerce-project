// pages/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Metodo ${req.method} non consentito` })
  }

  // Estraiamo anche "role" dalla request
  const { email, password, role } = req.body as {
    email?: string
    password?: string
    role?: string
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatori' })
  }

  // Controlla esistenza utente
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(404).json({ message: 'Utente non registrato' })
  }

  // Se il client ha inviato un role, verifichiamo che corrisponda a quello del DB
  if (role && role.toLowerCase() !== user.role.toLowerCase()) {
    return res.status(403).json({ message: 'Accesso non consentito per questo ruolo' })
  }

  // Verifica password
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ message: 'Credenziali non valide' })
  }

  // Genera JWT
  if (!process.env.JWT_SECRET) {
    console.error('[login] JWT_SECRET non configurato')
    return res.status(500).json({ message: 'Errore interno' })
  }
  const token = sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  )
  console.log('Logging in user:', user.email, 'role:', user.role);

res.setHeader('Set-Cookie', serialize('auth', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 2 * 60 * 60,
}));

console.log('Set-Cookie header:', res.getHeader('Set-Cookie'));

  // Ritorna dati utili al client
  return res.status(200).json({ email: user.email, role: user.role })
}
