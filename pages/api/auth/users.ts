import { NextApiRequest, NextApiResponse } from 'next';
import { authorizeAdmin } from '../../../utils/auth';
import prisma from '../../../utils/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
  res.status(200).json(users);
}

export default authorizeAdmin(handler);
