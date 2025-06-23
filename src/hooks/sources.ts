import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

// hooks
export const useGetSourcesQuery = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: getSources,
  })
}

// funções
export const getSources = async () => {
  const { data } = await supabase.from('source').select('*').order('name', { ascending: true })
  return data
}
