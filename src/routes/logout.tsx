import { Logout } from '@/components/Logout'
import isAuthenticated from '@/hooks/isAutheticated'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  beforeLoad: async () => {
    const authenticated = await isAuthenticated()
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
