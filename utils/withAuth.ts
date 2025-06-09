// utils/withAuth.ts
import { Role } from '@prisma/client'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPayloadFromReq } from './auth';

export function withRole(handler: GetServerSideProps, allowed: Role[]) {
    return async (ctx: GetServerSidePropsContext) => {
        const payload = getPayloadFromReq(ctx.req as any);
        if (!payload || !allowed.includes(payload.role as Role)) {
            return { redirect: { destination: '/login', permanent: false } };
        }
        return handler(ctx);
    };
}
