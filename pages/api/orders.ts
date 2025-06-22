// pages/api/orders.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/prisma'
import { getPayloadFromReq } from '../../utils/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // Extract user payload from request (e.g., JWT in cookie)
  const payload = getPayloadFromReq(req)
 

  const userId = (payload as any)?.id
  if (!payload || !userId) {
    // Return cookie and payload for debugging
    return res.status(401).json({
      message: 'Non autenticato',
      receivedCookies: req.headers.cookie || null,
      parsedPayload: payload || null,
    })
  }

  // Authorized: fetch orders
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
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
  } catch (error) {
    console.error('[Orders API] prisma error:', error)
    const errorMessage = (error instanceof Error) ? error.message : String(error)
    return res.status(500).json({ message: 'Errore server interno', error: errorMessage })
  }
}
