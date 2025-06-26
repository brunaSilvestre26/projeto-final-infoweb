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

export const useGetUsersByAuthorsIdsQuery = (authorIds: string[]) => {
  return useQuery({
    queryKey: ['getUsersByAuthorsIds', authorIds],
    queryFn: () => getUsersByAuthorsIdsQuery(authorIds),
    enabled: authorIds.length > 0, // só executa se authorIds não estiver vazio
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

const getUsersByAuthorsIdsQuery = async (authorIds: string[]) => {
  const { data: authorsData } = await supabase.from('author').select('*').in('id', authorIds)

  if (!authorsData) return []

  const { data: usersData } = await supabase
    .from('user')
    .select('*')
    .in(
      'id',
      authorsData.map((author) => author.user_id!)
    )
  return usersData
}
