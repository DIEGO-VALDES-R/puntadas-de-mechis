import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/routers';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      // Usa VITE_API_URL si está definida, sino fallback local
      url: import.meta.env.VITE_API_URL ?? '/api/trpc',
    }),
  ],
});
