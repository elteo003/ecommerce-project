// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { setLoginSession } from '../../../utils/auth'
import bcrypt from 'bcryptjs'

const MASTER_PASSWORD = '12345Aa!'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const { email, password, role } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password obbligatorie' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ message: 'Utente non trovato' })
  }

  // — master‐login ADMIN: basta la MASTER_PASSWORD e role==='admin'
  if (password === MASTER_PASSWORD && role === 'admin') {
    await setLoginSession(res, {
      id: user.id,
      email: user.email,
      role: 'ADMIN',
    })
    return res.status(200).json({ message: 'Login admin riuscito' })
  }

  // — altrimenti login classico CUSTOMER/ARTISAN
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Password errata' })
  }
  if (role && role.toUpperCase() !== user.role.toUpperCase()) {
    return res.status(403).json({ message: 'Accesso non consentito a questo ruolo' })
  }

  await setLoginSession(res, {
    id: user.id,
    email: user.email,
    role: user.role,
  })
  return res.status(200).json({ message: 'Login riuscito' })
}
