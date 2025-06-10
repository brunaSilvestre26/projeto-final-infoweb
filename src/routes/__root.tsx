import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import isAuthenticated from '@/hooks/isAutheticated'
import { getUser } from '@/hooks/useGetUser'
import { getUserById } from '@/hooks/useGetUserInfo'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.fetchQuery({
      queryKey: ['getUser'],
      queryFn: getUser,
    })

    const authenticated = await isAuthenticated()

    if (authenticated) {
      await queryClient.prefetchQuery({
        queryKey: ['userById', user?.id],
        queryFn: () => getUserById(user?.id!),
      })
    }
  },
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <Header onSearchChange={() => {}} searchQuery="" isAdmin={true} onToggleAdmin={() => {}} />
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex justify-center min-h-screen w-full">
          <PageLayout />
        </div>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
})
