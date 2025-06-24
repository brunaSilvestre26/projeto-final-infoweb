import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSourcesQuery } from '@/hooks/sources'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, RefreshCw } from 'lucide-react'
export const Route = createFileRoute('/fontes')({
  component: RouteComponent,
})

function RouteComponent() {
  const sources = useGetSourcesQuery()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sources.data?.map((source) => (
        <Card key={source.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{source.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={source.is_active ? 'default' : 'secondary'}>
                  {source.is_active ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>

              {source.url && <p className="text-sm text-muted-foreground break-all">{source.url}</p>}

              {source.updated_at && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span>Última atualização: {new Date(source.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
