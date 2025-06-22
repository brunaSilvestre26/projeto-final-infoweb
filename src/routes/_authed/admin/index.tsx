import { ArticleList } from '@/components/ArticleList'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAllArticlesQuery, useGetArticlesByAuthorIdQuery } from '@/hooks/articles'
import { useGetAuthorByIdQuery } from '@/hooks/authors'
import { useGetRoleByIdQuery } from '@/hooks/roles'
import { useGetUserByIdQuery, useGetUserQuery } from '@/hooks/user'
import { createFileRoute } from '@tanstack/react-router'
import { Filter } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>('all')

  const user = useGetUserQuery()
  const userById = useGetUserByIdQuery(user.data?.id!)
  const currentUserRole = useGetRoleByIdQuery(userById.data?.role_id!)
  const authorById = useGetAuthorByIdQuery(user.data?.id)

  // Se for writer, obter os artigos escritos por este autor
  const articlesByAuthorId = useGetArticlesByAuthorIdQuery(authorById.data?.id!)
  // Se for reviewer ou admin, obter os artigos escritos por todos os autores
  const allArticles = useGetAllArticlesQuery()

  // Se o utilizador for um writer, os artigos são filtrados pelos artigos escritos por este autor
  // Se for reviewer ou admin, os artigos são todos os artigos
  const articles = currentUserRole.data?.name === 'Writer' ? articlesByAuthorId.data : allArticles.data

  // Filtrar artigos pelo estado selecionado
  const filteredArticles =
    selectedStatus !== 'all' ? articles?.filter((article) => article.status === selectedStatus) : articles

  if (
    user.isLoading ||
    user.isFetching ||
    userById.isLoading ||
    currentUserRole.isLoading ||
    authorById.isLoading ||
    articlesByAuthorId.isLoading ||
    allArticles.isLoading
  ) {
    return <div>A carregar...</div>
  }

  if (
    articlesByAuthorId.isError ||
    allArticles.isError ||
    user.isError ||
    userById.isError ||
    currentUserRole.isError ||
    authorById.isError
  ) {
    return <div>Erro ao carregar artigos</div>
  }

  if (articlesByAuthorId.data?.length === 0 && currentUserRole.data?.name === 'Writer') {
    return <div>Não existem artigos criados por este autor</div>
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col gap-2 w-full justify-center items-end mb-4 pr-10">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="gap-1 flex items-center text-muted-foreground hover:text-gray-900 transition-colors cursor-pointer"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </button>
        {showFilters && (
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <ArticleList isBackoffice={true} articles={filteredArticles} />
    </div>
  )
}
