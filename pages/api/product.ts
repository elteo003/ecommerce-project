// /pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true }
      }
    }
  })

  // Mappiamo per restituire un formato leggibile
  const formatted = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category?.name ?? 'Senza categoria'
  }))

  res.status(200).json(formatted)
}
