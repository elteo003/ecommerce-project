// pages/api/orders.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/prisma'
import { getPayloadFromReq } from '../../utils/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const payload = getPayloadFromReq(req)
    const userId = (payload as any)?.id
    if (!payload || !userId) {
        return res.status(401).json({ message: 'Non autenticato' })
    }

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            items: { include: { product: true } },
        },
    })

    const formatted = orders.map(o => ({
        id: o.id,
        createdAt: o.createdAt,
        total: o.total,
        items: o.items.map(i => ({
            productId: i.productId,
            name: i.product.name,
            price: i.price,
            quantity: i.quantity,
        })),
    }))

    return res.status(200).json({ orders: formatted })
}