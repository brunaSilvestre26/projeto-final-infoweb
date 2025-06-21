import { Logout } from '@/components/Logout'
import { isAuthenticatedQueryOptions } from '@/hooks/isAutheticated'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const authenticated = await queryClient.fetchQuery(isAuthenticatedQueryOptions)
    if (!authenticated) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Logout />
}
