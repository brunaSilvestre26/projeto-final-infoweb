import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fontes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/fontes"!</div>
}
