import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

// hooks
export const useGetTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}

// funções
export const getTags = async () => {
  const { data } = await supabase.from('tag').select('id, name')
  return data
}
