import { ArticleList } from '@/components/ArticleList'
import { useGetApprovedArticlesQuery } from '@/hooks/articles'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/tag/$tagName')({
  component: RouteComponent,
})

function RouteComponent() {
  const articles = useGetApprovedArticlesQuery()
  const { tagName } = useParams({ from: '/tag/$tagName' })

  const filteredArticles = articles.data?.filter((article) =>
    article.article_tags?.some((tag) => {
      return tag.slug === tagName
    })
  )

  if (!filteredArticles || filteredArticles.length === 0) {
    return <div className="text-center mt-8">Nenhum artigo encontrado para a tag selecionada</div>
  }

  return <ArticleList articles={filteredArticles} />
}
