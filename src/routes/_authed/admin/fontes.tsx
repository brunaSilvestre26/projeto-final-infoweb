import { MobileSourceManagement } from '@/components/MobileSourceManagement'
import { SourceManagement } from '@/components/SourceManagement'
import { getRoleById } from '@/hooks/roles'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getUser, getUserById } from '@/hooks/user'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/fontes')({
  beforeLoad: async () => {
    const user = await getUser()

    if (!user) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
    const userById = await getUserById(user.id)
    if (!userById) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }

    const role = await getRoleById(userById?.role_id!)

    if (role?.name !== 'Admin') {
      throw redirect({
        to: '/admin',
        replace: true,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <MobileSourceManagement />
  }

  return <SourceManagement />
}
