import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

export const useGetRoleByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['roleById', id],
    queryFn: () => getRoleById(id),
    enabled: !!id, // só executa se id estiver definido
  })
}

export const useGetRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })
}

export const getRoleById = async (id: string) => {
  const { data } = await supabase.from('role').select('*').eq('id', id).single()
  return data
}

const getRoles = async () => {
  const { data } = await supabase.from('role').select('*')
  return data
}
