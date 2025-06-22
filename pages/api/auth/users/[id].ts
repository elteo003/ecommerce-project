import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const updated = await prisma.user.update({
      where: { id: id as string },
      data: req.body,
    });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.user.delete({ where: { id: id as string } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Metodo ${req.method} non permesso`);
}
