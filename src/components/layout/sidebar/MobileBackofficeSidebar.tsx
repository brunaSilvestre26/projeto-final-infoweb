import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useGetRoleByIdQuery } from '@/hooks/roles'
import { useGetUserByIdQuery, useGetUserQuery } from '@/hooks/user'
import { Link, useLocation } from '@tanstack/react-router'
import { FileText, Globe, Menu, Plus, Tag, User } from 'lucide-react'
import { useState } from 'react'

export const MobileBackofficeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const location = useLocation()
  const user = useGetUserQuery()
  const userById = useGetUserByIdQuery(user.data?.id!)
  const role = useGetRoleByIdQuery(userById.data?.role_id!)
  const isAdmin = role.data?.name === 'Admin'
  const isReviewer = role.data?.name === 'Reviewer'

  const writerViews = [
    { id: 'gerir', label: 'Gerir Artigos', icon: FileText, path: '/admin' },
    { id: 'criar', label: 'Criar Artigo', icon: Plus, path: '/admin/criar' },
  ]

  const reviewerViews = [...writerViews]

  const adminViews = [
    ...reviewerViews,
    { id: 'contas', label: 'Gerir Contas', icon: User, path: '/admin/contas' },
    { id: 'fontes', label: 'Gerir Fontes', icon: Globe, path: '/admin/fontes' },
    { id: 'tags', label: 'Gerir Tags', icon: Tag, path: '/admin/tags' },
  ]

  const views = isAdmin ? adminViews : isReviewer ? reviewerViews : writerViews

  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname === path) return true
    if (location.pathname.startsWith('/admin/edit') && path === '/admin') return true
    return false
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild onClick={() => setIsOpen(!isOpen)}>
        <Menu className="cursor-pointer" />
      </SheetTrigger>

      <SheetContent side="left" className="p-5">
        <SheetHeader>
          <SheetTitle>
            <Link to="/">
              <img src="/logoJornalismoUBIbackoffice.png" alt="Logo" className="h-7" />
            </Link>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div>
          {views.map((view) => {
            const Icon = view.icon
            return (
              <Link key={view.id} to={view.path} onClick={() => setIsOpen(false)}>
                <Button variant={isActiveRoute(view.path) ? 'default' : 'ghost'} className="w-full justify-start">
                  <Icon className="h-5 w-5 mr-3" />
                  {view.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
