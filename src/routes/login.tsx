import { Login } from '@/components/Login'
import { isAuthenticatedQueryOptions } from '@/hooks/isAutheticated'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const authenticated = await queryClient.fetchQuery(isAuthenticatedQueryOptions)
    if (authenticated) {
      throw redirect({
        to: '/',
        replace: true,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-10">
      <Login />
    </div>
  )
}
