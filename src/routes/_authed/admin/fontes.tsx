import { SourceManagement } from '@/components/SourceManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/fontes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SourceManagement />
}
