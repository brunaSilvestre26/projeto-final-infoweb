import { Button } from '@/components/ui/button'
import { Link, useLocation } from '@tanstack/react-router'
import { Globe, Home } from 'lucide-react'
import { categories } from '../../data/mockData'
import { Category } from '../../types'

export function PublicSidebar() {
  const location = useLocation()

  const publicViews = [
    { id: 'home', label: 'All News', icon: Home, path: '/' },
    { id: 'sources', label: 'Sources', icon: Globe, path: '/sources' },
  ]

  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav>
      <>
        {publicViews.map((view) => {
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
      </>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 mt-4">Categories</h3>
        <div className="space-y-1">
          <Link to="/">
            <Button variant={location.pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
              All Categories
            </Button>
          </Link>
          {categories.map((category: Category) => (
            <Link key={category.id} to="" href={`/category/${category.slug}`}>
              <Button
                variant={location.pathname === `/category/${category.slug}` ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
