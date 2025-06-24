import { ProfilePage } from '@/components/ProfilePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfilePage />
}
