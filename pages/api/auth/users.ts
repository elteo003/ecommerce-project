// pages/api/auth/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { getPayloadFromReq } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = getPayloadFromReq(req);
  if (!payload) return res.status(401).json({ message: 'Non autenticato' });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      password: true, // Aggiunto
    },
  });

  res.status(200).json(users);
}
