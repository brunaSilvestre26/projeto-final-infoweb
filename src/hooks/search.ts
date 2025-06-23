import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

export const useSearchQuery = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchTitlesSummaryContent(query),
  })
}

export const searchTitlesSummaryContent = async (query: string) => {
  const { data: titleData, error: titleError } = await supabase.from('article').select().textSearch('title', query, {
    type: 'websearch',
    config: 'simple',
  })

  if (titleError) {
    throw new Error(`Error searching titles: ${titleError.message}`)
  }

  const { data: summaryData, error: summaryError } = await supabase
    .from('article')
    .select()
    .textSearch('summary', query, {
      type: 'websearch',
      config: 'simple',
    })

  if (summaryError) {
    throw new Error(`Error searching summaries: ${summaryError.message}`)
  }

  const { data: contentData, error: contentError } = await supabase
    .from('article')
    .select()
    .textSearch('content', query, {
      type: 'websearch',
      config: 'simple',
    })

  if (contentError) {
    throw new Error(`Error searching titles: ${contentError.message}`)
  }

  // Combine results from all three searches
  const data = [...(titleData || []), ...(summaryData || []), ...(contentData || [])]

  // Remove duplicates based on article ID
  const tempArticleIds = new Set()
  const dataWithoutDuplicates = data.filter(({ id }) => !tempArticleIds.has(id) && tempArticleIds.add(id))

  return dataWithoutDuplicates
}
