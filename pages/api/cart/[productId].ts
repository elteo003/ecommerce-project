// pages/api/cart/[productId].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { getPayloadFromReq } from "../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = getPayloadFromReq(req);
  const userId = (payload as any)?.id;
  if (!userId) return res.status(401).json({ message: "Non autenticato" });

  const { productId } = req.query as { productId: string };

  if (req.method === "PATCH") {
    const { quantity } = req.body;
    const updated = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    // rimuove un singolo item
    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
