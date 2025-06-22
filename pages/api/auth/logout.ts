// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Metodo ${req.method} non consentito` });
  }

  // Invalida il cookie 'auth'
  res.setHeader(
    'Set-Cookie',
    serialize('auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    })
  );

  return res.status(200).json({ message: 'Logout effettuato' });
}
