import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

// hooks
export const useGetAuthorsQuery = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
  })
}

export const useGetAuthorByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: ['authorById', id],
    queryFn: () => getAuthorById(id),
    enabled: !!id, // só executa se id estiver definido
  })
}

// funções
export const getAuthors = async () => {
  const { data } = await supabase.from('author').select('id, name')
  return data
}

export const getAuthorById = async (id?: string) => {
  if (!id) {
    return null
  }

  const { data } = await supabase.from('author').select('*').eq('user_id', id).single()
  return data
}
