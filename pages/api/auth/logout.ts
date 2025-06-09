// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  // Imposta il cookie di token a stringa vuota e scaduto immediatamente
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    })
  )

  // Rispondi con successo
  res.status(200).json({ message: 'Logout effettuato' })
}
