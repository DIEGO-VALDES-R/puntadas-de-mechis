// src/lib/trpcClient.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/routers';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/trpc` // solo /trpc, no /api/trpc
        : '/api/trpc', // fallback relativo para local
    }),
  ],
});
