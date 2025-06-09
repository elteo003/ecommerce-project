// percorso: pages/api/cart/[itemId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { getUserFromRequest } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const payload = getUserFromRequest(req, res);
    if (!payload) return;
    const userId = payload.id;
    const { itemId } = req.query as { itemId: string };

    const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
    });
    if (!item || item.userId !== userId) {
        return res.status(403).json({ message: 'Non autorizzato o item inesistente' });
    }

    switch (req.method) {
        case 'PUT':
            try {
                const { quantity } = req.body as { quantity?: number };
                if (typeof quantity !== 'number' || quantity < 1) {
                    return res.status(400).json({ message: 'Quantity invalida' });
                }
                const updated = await prisma.cartItem.update({
                    where: { id: itemId },
                    data: { quantity },
                    include: { product: true },
                });
                return res.status(200).json(updated);
            } catch (err) {
                console.error('[PUT /api/cart/[itemId]] Errore:', err);
                return res.status(500).json({ message: 'Errore aggiornamento carrello' });
            }

        case 'DELETE':
            try {
                await prisma.cartItem.delete({ where: { id: itemId } });
                return res.status(204).end();
            } catch (err) {
                console.error('[DELETE /api/cart/[itemId]] Errore:', err);
                return res.status(500).json({ message: 'Errore rimozione dal carrello' });
            }

        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            return res.status(405).end(`Metodo ${req.method} non consentito`);
    }
}
