// utils/auth.ts
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface Payload {
  userId: string;
  email: string;
  role: string;
}

export function getPayloadFromReq(req: NextApiRequest | { headers: any }): Payload | null {
  try {
    const cookies = req.headers?.cookie;
    if (!cookies) return null;

    const parsed = parse(cookies);
    const token = parsed.token;
    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET);
    return payload as Payload;
  } catch (err) {
    return null;
  }
}
