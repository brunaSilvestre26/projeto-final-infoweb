import { Button } from '@/components/ui/button'
import { useGetRoleByIdQuery, useGetUserByIdQuery, useGetUserQuery } from '@/hooks/user'
import { Link, useLocation } from '@tanstack/react-router'
import { FileText, Globe, Plus, Settings, Tag, User } from 'lucide-react'

export function BackofficeSidebar() {
  const location = useLocation()
  const user = useGetUserQuery()
  const userById = useGetUserByIdQuery(user.data?.id!)
  const role = useGetRoleByIdQuery(userById.data?.role_id!)
  const isAdmin = role.data?.name === 'Admin'
  const isReviewer = role.data?.name === 'Reviewer'

  const writerViews = [
    { id: 'manage', label: 'Manage Articles', icon: FileText, path: '/admin' },
    { id: 'create', label: 'Create Article', icon: Plus, path: '/admin/create' },
  ]

  const reviewerViews = [...writerViews]

  const adminViews = [
    ...reviewerViews,
    { id: 'categories', label: 'Categories', icon: Tag, path: '/admin/categories' },
    { id: 'sources', label: 'Sources', icon: Globe, path: '/admin/sources' },
    { id: 'accounts', label: 'Accounts', icon: User, path: '/admin/accounts' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ]

  const views = isAdmin ? adminViews : isReviewer ? reviewerViews : writerViews

  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname === path) return true
    if (location.pathname.startsWith('/admin/edit') && path === '/admin') return true
    return false
  }

  return (
    <nav>
      {views.map((view) => {
        const Icon = view.icon
        return (
          <Link key={view.id} to={view.path}>
            <Button variant={isActiveRoute(view.path) ? 'default' : 'ghost'} className="w-full justify-start">
              <Icon className="h-5 w-5 mr-3" />
              {view.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
