import { supabase } from '@/supabase/supabase'
import { useQuery } from '@tanstack/react-query'

export const useGetUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['userById', id],
    queryFn: () => getUserById(id),
  })
}

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ['getUser'],
    queryFn: getUser,
  })
}

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
  })
}

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export const getUserById = async (id: string) => {
  const { data } = await supabase.from('user').select('*').eq('id', id).single()
  return data
}

const getUsers = async () => {
  const { data } = await supabase.from('user').select('*')
  return data
}
