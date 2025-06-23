import { Button } from '@/components/ui/button'
import { useGetTagsQuery } from '@/hooks/tags'
import { Link, useLocation } from '@tanstack/react-router'
import { Globe, Home } from 'lucide-react'

export function PublicSidebar() {
  const location = useLocation()
  const tags = useGetTagsQuery()

  function getBlueShade(index: number, total: number) {
    // Hue for blue is around 210-230, saturation 80%, lightness varies
    const minLightness = 20
    const maxLightness = 80
    const lightness = minLightness + ((maxLightness - minLightness) * index) / Math.max(total - 1, 1)
    return `hsl(220, 80%, ${lightness}%)`
  }

  const publicViews = [
    { id: 'home', label: 'Todos os Artigos', icon: Home, path: '/' },
    { id: 'fontes', label: 'Fontes', icon: Globe, path: '/fontes' },
  ]

  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  if (tags.isLoading) {
    return <div>A carregar...</div>
  }

  if (tags.isError || !tags.data) {
    return <div>Erro ao carregar tags</div>
  }

  if (tags.data.length === 0) {
    return <div>Nenhuma tag disponível</div>
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
          {tags.data?.map((tag, idx) => (
            <Link key={tag.id} to="" href={`/tag/${tag.slug}`}>
              <Button
                variant={location.pathname === `/tag/${tag.slug}` ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getBlueShade(idx, tags.data?.length!) }}
                />
                {tag.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
