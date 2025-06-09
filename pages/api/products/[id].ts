import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id as string) } });
  if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
  res.status(200).json(product);
}
