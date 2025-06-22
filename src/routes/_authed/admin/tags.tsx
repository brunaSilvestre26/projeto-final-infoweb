import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/tags')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/admin/tags"!</div>
}
