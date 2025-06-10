import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sources')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-9xl">Hello "/sources"!</h1>
    </div>
  )
}
