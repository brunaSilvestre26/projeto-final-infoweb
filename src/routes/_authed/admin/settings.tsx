import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/admin/settings"!</div>
}
