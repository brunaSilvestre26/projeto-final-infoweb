import { Button } from '@/components/ui/button'
import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import { Globe, Home } from 'lucide-react'

type Tag = {
  id: string
  name: string
  slug: string
  color: string
}

export function PublicSidebar() {
  const location = useLocation()

  const publicViews = [
    { id: 'home', label: 'Todos os Artigos', icon: Home, path: '/' },
    { id: 'sources', label: 'Fontes', icon: Globe, path: '/sources' },
  ]

  const blueShades = ['#03045E', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8']

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tag').select('id, name, slug')
      if (error) throw error
      return data.map((tag, index) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug /* tag.name.toLowerCase().replace(/\s+/g, '-') */,
        color: blueShades[index % blueShades.length],
      }))
    },
  })

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
        <h3 className="text-sm font-semibold text-foreground mb-3 mt-4">Tags</h3>
        <div className="space-y-1">
          {categories.map((tag: Tag) => (
            <Link key={tag.id} to="" href={`/tag/${tag.slug}`}>
              <Button
                variant={location.pathname === `/tag/${tag.slug}` ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
