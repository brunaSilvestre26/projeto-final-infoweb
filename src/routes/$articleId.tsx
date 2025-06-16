import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetArticleById } from '@/hooks/articles'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Clock, User } from 'lucide-react'

export const Route = createFileRoute('/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { articleId } = useParams({ from: '/$articleId' })
  const article = useGetArticleById(articleId)

  if (article.isLoading) return <div>Carregando...</div>
  if (article.isError || !article.data) return <div>Artigo não encontrado.</div>

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex justify-center max-w-4xl w-full">
      <Card className="p-0 overflow-hidden w-full">
        {article.data.image_url && (
          <div className="aspect-21/9 overflow-hidden mb-4">
            <img
              src={article.data.image_url}
              alt={article.data.title || 'Imagem do artigo'}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <h1 className="text-3xl mb-3">
            <CardTitle className={!article.data.image_url ? 'mt-6' : ''}>{article.data.title}</CardTitle>
          </h1>

          <CardDescription>{article.data.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-none">{article.data.content}</div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-10 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{article.data.created_at ? formatDate(article.data.created_at) : 'Data desconhecida'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>
                {article.data.article_authors
                  ?.map((author) => author.name)
                  .filter(Boolean)
                  .join(', ') || 'Desconhecido'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 mt-4">
            <div className="flex flex-wrap gap-2">
              {article.data.article_tags?.map((tag) =>
                tag.name ? (
                  <Badge key={tag.tag_id} variant="secondary">
                    {tag.name}
                  </Badge>
                ) : null
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
