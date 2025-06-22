// pages/api/cart/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { getPayloadFromReq } from "../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = getPayloadFromReq(req);
  const userId = payload?.id;
  if (!userId) return res.status(401).json({ message: "Non autenticato" });

  if (req.method === "GET") {
    const raw = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const items = raw.map(ci => ({
      id: ci.id,
      productId: ci.productId,
      name: ci.product?.name ?? "Prodotto sconosciuto",
      price: ci.product?.price ?? 0,
      imageUrl: ci.product?.imageUrl ?? null,
      quantity: ci.quantity,
    }));

    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Dati mancanti" });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    const item = existing
      ? await prisma.cartItem.update({
          where: { userId_productId: { userId, productId } },
          data: { quantity: existing.quantity + quantity },
        })
      : await prisma.cartItem.create({
          data: {
            userId,
            productId,
            quantity,
          },
        });

    return res.status(200).json({ item });
  }

  if (req.method === "DELETE") {
    await prisma.cartItem.deleteMany({ where: { userId } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
