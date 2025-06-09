// pages/api/auth/me.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Metodo ${req.method} non consentito`);
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  const cookies = cookie.parse(req.headers.cookie || '');
  const auth = cookies.auth;
  if (!auth) return res.status(401).json({ message: 'Non autenticato' });

  if (!process.env.JWT_SECRET) {
    console.error('[me] JWT_SECRET non configurato');
    return res.status(500).json({ message: 'Errore interno' });
  }

  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,   // ← includi questi
        lastName: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    return res.status(200).json({
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

  } catch (err: any) {
    console.error('[me] Errore durante verify:', err);
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token non valido o scaduto' });
    }
    return res.status(500).json({ message: 'Errore interno' });
  }
}
