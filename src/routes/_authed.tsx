import { isAuthenticatedQueryOptions } from '@/hooks/isAutheticated'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const authenticated = await queryClient.fetchQuery(isAuthenticatedQueryOptions)

    if (!authenticated) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
  },
})
