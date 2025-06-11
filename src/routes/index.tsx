import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetApprovedArticles } from '@/hooks/articles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const articles = useGetApprovedArticles()
  // const articles = sampleArticles

  /*   if (articles.isLoading) return <div>Loading...</div>
  if (articles.isError) return <div>Erro ao carregar artigos.</div>
  if (!articles?.data?.length) return <div>Nenhum artigo encontrado.</div> */

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.data?.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>{article.summary}</CardDescription>
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
