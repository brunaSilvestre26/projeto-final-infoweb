import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/sources')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/admin/sources"!</div>
}
