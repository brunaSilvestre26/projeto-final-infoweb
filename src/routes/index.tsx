import { ArticleList } from '@/components/ArticleList'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetApprovedArticlesQuery } from '@/hooks/articles'
import { useGetSourcesQuery } from '@/hooks/sources'
import { createFileRoute } from '@tanstack/react-router'
import { Filter } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // TODO: Implement search functionality
  // TODO: Implement pagination

  const [showFilters, setShowFilters] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string | undefined>('all')

  const articles = useGetApprovedArticlesQuery()
  const sources = useGetSourcesQuery()

  const filteredArticles =
    selectedSource === 'JornalismoUBI'
      ? articles.data?.filter((article) => article.source_id === null)
      : selectedSource === 'all'
        ? articles.data
        : articles.data?.filter((article) => article.source_id === selectedSource)

  if (articles.isLoading || sources.isLoading) {
    return <div>A carregar...</div>
  }

  if (articles.isError || !articles.data) {
    return <div>Erro ao carregar artigos</div>
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
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="JornalismoUBI">JornalismoUBI</SelectItem>
                {sources.data?.map((source) => <SelectItem value={source.id}>{source.name}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <ArticleList articles={filteredArticles} />
    </div>
  )
}
