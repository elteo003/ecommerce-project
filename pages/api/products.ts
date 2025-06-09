import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, minPrice, maxPrice, available } = req.query;
    const where: any = {};
    if (category) where.category = { slug: category };
    if (minPrice || maxPrice) where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
    if (available === 'true') where.stock = { gt: 0 };

    const products = await prisma.product.findMany({ where });
    res.json(products);
}
