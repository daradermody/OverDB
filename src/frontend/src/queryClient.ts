import {QueryClient} from '@tanstack/react-query'
import {createTRPCClient, httpBatchLink} from '@trpc/client'
import type {AppRouter} from '../../routes'
import {createTRPCOptionsProxy} from '@trpc/tanstack-react-query'

export const queryClient = new QueryClient({defaultOptions:{queries:{staleTime: 1000 * 60 * 5}}})

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({url: '/api'})],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})
