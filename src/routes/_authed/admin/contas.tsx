import { AccountManagement } from '@/components/AccountManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/contas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountManagement />
}
