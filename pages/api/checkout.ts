// pages/api/checkout.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";
import { getPayloadFromReq } from "../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const payload = getPayloadFromReq(req);
  const userId = (payload as any)?.id;
  if (!userId) return res.status(401).json({ message: "Non autenticato" });

  // prendo tutto il carrello
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Carrello vuoto" });
  }

  // calcolo totale
  const total = cartItems.reduce((sum, ci) => sum + ci.quantity * ci.product.price, 0);

  // creo l'ordine
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "PAID",
      items: {
        create: cartItems.map(ci => ({
          productId: ci.productId,
          quantity: ci.quantity,
          price: ci.product.price,
        })),
      },
    },
    include: { items: true },
  });

  // svuoto il carrello
  await prisma.cartItem.deleteMany({ where: { userId } });

  return res.status(201).json(order);
}
