// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import bcrypt from 'bcrypt'

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Method ${req.method} not allowed` })
  }

  const { firstName, lastName, email, password, role } = req.body as {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: string
  }

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10)

  // Determine Prisma Role enum
  const prismaRole = role === 'artisan' ? 'ARTISAN' : 'CUSTOMER'

  // Create user
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashed,
      role: prismaRole,
    },
  })

  // Do not return password
  return res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  })
}
