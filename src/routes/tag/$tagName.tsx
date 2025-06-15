import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetApprovedArticles } from '@/hooks/articles'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/tag/$tagName')({
  component: RouteComponent,
})

function RouteComponent() {
  const articles = useGetApprovedArticles()
  const { tagName } = useParams({ from: '/tag/$tagName' })

  const filteredArticles = articles.data?.filter((article) =>
    article.article_tags?.some((tag) => {
      return tag.slug === tagName
    })
  )

  if (!filteredArticles || filteredArticles.length === 0) {
    return <div className="text-center mt-8">Nenhum artigo encontrado para a tag selecionada</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredArticles?.map((article) => (
        <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden" key={article.id}>
          {article.image_url && (
            <div className="aspect-video overflow-hidden -mt-6">
              <img
                src={article.image_url}
                alt={article.title || 'Imagem do artigo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <CardHeader>
            <Link to="/$articleId" params={{ articleId: article.id }}>
              <CardTitle className="group-hover:text-primary">{article.title}</CardTitle>
              <CardDescription>{article.summary}</CardDescription>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">
              Autores:{' '}
              {article.article_authors
                ?.map((a) => a.name)
                .filter(Boolean)
                .join(', ') || 'Desconhecido'}
            </div>
            <div className="flex flex-wrap gap-2">
              {article.article_tags?.map((tag) =>
                tag.name ? (
                  <span key={tag.tag_id} className="bg-muted px-2 py-1 rounded text-xs">
                    {tag.name}
                  </span>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
