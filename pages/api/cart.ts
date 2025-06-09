import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../utils/auth';
import prisma from '../../utils/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req.user as any).id;
  if (req.method === 'GET') {
    const orders = await prisma.order.findMany({ where: { userId }, include: { products: true } });
    const cartProducts = orders.flatMap(order => order.products);
    res.status(200).json(cartProducts);
  } else if (req.method === 'POST') {
    const { productId } = req.body;
    // Add to cart: create order with single product for simplicity
    const order = await prisma.order.create({
      data: {
        userId,
        products: {
          connect: { id: productId }
        }
      }
    });
    res.status(201).json(order);
  } else {
    res.status(405).end();
  }
}

export default authenticate(handler);
