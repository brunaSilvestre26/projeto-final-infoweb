import { ArticleList } from '@/components/ArticleList'
import { useGetApprovedArticlesQuery } from '@/hooks/articles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // TODO: Implement search functionality
  // TODO: Implement pagination

  const articles = useGetApprovedArticlesQuery()

  if (articles.isLoading) {
    return <div>A carregar...</div>
  } else if (articles.isError) {
    return <div>Erro ao carregar artigos</div>
  } else if (articles.data) {
    return <ArticleList articles={articles.data} />
  }
}
