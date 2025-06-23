import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

// hooks
export const useGetTagsQuery = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}

// funções
export const getTags = async () => {
  const { data } = await supabase.from('tag').select('*')
  return data
}
