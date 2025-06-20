import { ArticleList } from '@/components/ArticleList'
import { useGetArticlesByAuthorIdQuery } from '@/hooks/articles'
import { useGetAuthorByIdQuery } from '@/hooks/authors'
import { useGetUserQuery } from '@/hooks/user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useGetUserQuery()
  const authorById = useGetAuthorByIdQuery(user.data?.id)
  const articlesByAuthorId = useGetArticlesByAuthorIdQuery(authorById.data?.id!)

  if (user.isLoading || articlesByAuthorId.isLoading || !user.data) {
    return <div>A carregar...</div>
  }

  if (articlesByAuthorId.data?.length === 0) {
    return <div>Não existem artigos criados por este autor</div>
  }

  if (articlesByAuthorId.isLoading) {
    return <div>A carregar...</div>
  } else if (articlesByAuthorId.isError) {
    return <div>Erro ao carregar artigos</div>
  } else if (articlesByAuthorId.data) {
    return <ArticleList isBackoffice={true} articles={articlesByAuthorId.data} />
  }
}
