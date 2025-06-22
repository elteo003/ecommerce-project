// pages/api/product/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({ where: { id: id as string } });
    if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
    return res.status(200).json(product);
  }

  if (req.method === 'PUT') {
    const updated = await prisma.product.update({
      where: { id: id as string },
      data: req.body,
    });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.product.delete({ where: { id: id as string } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Metodo ${req.method} non permesso`);
}
