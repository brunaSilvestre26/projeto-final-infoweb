import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetArticleById } from '@/hooks/articles'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { articleId } = useParams({ from: '/$articleId' })
  const article = useGetArticleById(articleId)

  if (article.isLoading) return <div>Carregando...</div>
  if (article.isError || !article.data) return <div>Artigo não encontrado.</div>

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
          <CardTitle className={!article.data.image_url ? 'mt-6' : ''}>{article.data.title}</CardTitle>
          <CardDescription>{article.data.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-none">{article.data.content}</div>
          <div className="mb-2 text-sm text-muted-foreground mt-10">
            {article.data.article_authors?.length === 1 ? 'Autor' : 'Autores'}:{' '}
            {article.data.article_authors
              ?.map((author) => author.name)
              .filter(Boolean)
              .join(', ') || 'Desconhecido'}
          </div>
          <div className="flex flex-wrap gap-2 mb-6 mt-4">
            {article.data.article_tags?.map((tag) =>
              tag.name ? (
                <span key={tag.tag_id} className="bg-muted px-2 py-1 rounded text-xs">
                  {tag.name}
                </span>
              ) : null
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
