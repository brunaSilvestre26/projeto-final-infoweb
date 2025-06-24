import { useSearchQuery } from '@/hooks/search'
import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'

export const SearchResultsList = ({
  query,
  setIsOpenModal,
}: {
  query: string
  setIsOpenModal: (open: boolean) => void
}) => {
  const searchResults = useSearchQuery(query)

  if (!query) {
    return (
      <ScrollArea className="px-6 pb-6 max-h-[50vh] overflow-auto">
        <div className="flex flex-col items-center">
          <Search size={40} className="text-muted-foreground mb-2" />
          <p className="text-lg font-medium text-muted-foreground mb-2">Comece a escrever para pesquisar</p>
          <p className="text-sm text-muted-foreground">Pesquise artigos por título, conteúdo ou resumo</p>
        </div>
      </ScrollArea>
    )
  }

  if (searchResults.isLoading) {
    return (
      <ScrollArea className="px-6 pb-6 max-h-[50vh] overflow-auto">
        <div className="flex items-center justify-center">
          <div className="relative h-4 w-4 flex items-center justify-center">
            <span className="absolute inline-block h-4 w-4 rounded-full border-2 border-text-muted-foreground"></span>
            <span className="inline-block h-4 w-4 rounded-full border-2 border-b-neutral-800 border-t-transparent animate-spin"></span>
          </div>
          <span className="ml-3 text-muted-foreground">A procurar...</span>
        </div>
      </ScrollArea>
    )
  }

  if (searchResults.data?.length === 0) {
    return (
      <ScrollArea className="px-6 pb-6 max-h-[50vh] overflow-auto">
        <div className="flex flex-col items-center">
          <Search size={40} className="text-muted-foreground mb-2" />
          <p className="text-lg font-medium text-muted-foreground mb-2">Sem resultados encontrados</p>
          <p className="text-sm text-muted-foreground">Tente ajustar os termos da sua pesquisa</p>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="px-6 pb-6 max-h-[50vh] overflow-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground mb-3">
          {searchResults.data?.length} resultado{searchResults.data?.length !== 1 ? 's' : ''} encontrado
          {searchResults.data?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {searchResults.data?.map((article) => (
        <Card key={article.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden mb-4">
          <CardContent>
            {/* Se a fonte for JornalismoUBI, utilizar Link interno, se não, utiliza anchor tag para link externo */}
            {!article.url ? (
              <Link to="/$articleId" params={{ articleId: article.id }} onClick={() => setIsOpenModal(false)}>
                <CardTitle className="group-hover:text-primary mb-6">{article.title}</CardTitle>
                <CardDescription>{article.summary}</CardDescription>
              </Link>
            ) : (
              <a href={article.url!} target="_blank">
                <CardTitle className="group-hover:text-primary mb-6">{article.title}</CardTitle>
                <CardDescription>{article.summary}</CardDescription>
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  )
}
