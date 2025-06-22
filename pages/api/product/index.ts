import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const products = await prisma.product.findMany();
  res.status(200).json(products);
}
