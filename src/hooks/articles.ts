import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

// hooks
export const useGetApprovedArticles = () => {
  return useQuery({
    queryKey: ['approvedArticles'],
    queryFn: getApprovedArticles,
  })
}

export const useGetArticleById = (id?: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  })
}

// funções
// vai buscar artigos aprovados, com authors e tags
export const getApprovedArticles = async () => {
  const articlesResponse = await supabase
    .from('article')
    .select(
      `
        id, 
        title,
        summary,
        content,
        image_url,
        created_at,
        updated_at,
        is_approved,
        source_id,
        url,
        article_authors (author_id),
        article_tags (tag_id)
      `
    )
    .eq('is_approved', true)

  const tagsResponse = await supabase
    .from('tag')
    .select('name, slug, id')
    .in('id', articlesResponse.data?.flatMap((article) => article.article_tags.map((tag) => tag.tag_id))!)

  const authorsResponse = await supabase
    .from('author')
    .select('name, id')
    .in('id', articlesResponse.data?.flatMap((article) => article.article_authors.map((author) => author.author_id))!)

  // Mapear ids para nomes
  const tagsMap = Object.fromEntries((tagsResponse.data ?? []).map((tag) => [tag.id, tag.name]))
  const tagsSlugMap = Object.fromEntries((tagsResponse.data ?? []).map((tag) => [tag.id, tag.slug]))
  const authorsMap = Object.fromEntries((authorsResponse.data ?? []).map((author) => [author.id, author.name]))

  // Montar resultado final
  const completeResponse = articlesResponse.data?.map((article) => ({
    ...article,
    article_tags: (article.article_tags ?? []).map((tag) => ({
      tag_id: tag.tag_id,
      slug: tagsSlugMap[tag.tag_id] || null,
      name: tagsMap[tag.tag_id] || null,
    })),
    article_authors: (article.article_authors ?? []).map((author) => ({
      author_id: author.author_id,
      name: authorsMap[author.author_id] || null,
    })),
  }))

  return completeResponse
}

export const getArticleById = async (id?: string) => {
  if (!id) return
  const articleResponse = await supabase
    .from('article')
    .select(
      `
        id, 
        title,
        summary,
        content,
        image_url,
        created_at,
        updated_at,
        is_approved,
        source_id,
        url,
        article_authors (author_id),
        article_tags (tag_id)
      `
    )
    .eq('id', id)
    .single()

  const tagsResponse = await supabase
    .from('tag')
    .select('name, id')
    .in('id', articleResponse.data?.article_tags.map((tag) => tag.tag_id)!)

  const authorsResponse = await supabase
    .from('author')
    .select('name, id')
    .in('id', articleResponse.data?.article_authors.map((author) => author.author_id)!)

  // Mapear ids para nomes
  const tagsMap = Object.fromEntries((tagsResponse.data ?? []).map((tag) => [tag.id, tag.name]))
  const authorsMap = Object.fromEntries((authorsResponse.data ?? []).map((author) => [author.id, author.name]))

  // Montar resultado final

  const completeResponse = {
    ...articleResponse.data,
    article_tags: tagsResponse.data?.map((tag) => ({
      tag_id: tag.id,
      name: tagsMap[tag.id] || null,
    })),
    article_authors: authorsResponse.data?.map((author) => ({
      author_id: author.id,
      name: authorsMap[author.id] || null,
    })),
  }

  return completeResponse
}
