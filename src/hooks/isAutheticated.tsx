import { supabase } from '@/supabase/supabase'
import { queryOptions } from '@tanstack/react-query'

export default async function isAuthenticated() {
  const { data, error } = await supabase.auth.getUser()
  if (data.user) return true
  if (error) return false
  return false
}

export const isAuthenticatedQueryOptions = queryOptions({
  queryKey: ['isAuthenticated'],
  queryFn: () => isAuthenticated(),
  staleTime: 5 * 60 * 1000,
})
