import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { isAuthenticatedQueryOptions } from '@/hooks/isAutheticated'
import { getUser, getUserById } from '@/hooks/user'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.fetchQuery({
      queryKey: ['getUser'],
      queryFn: getUser,
    })

    const authenticated = await queryClient.fetchQuery(isAuthenticatedQueryOptions)

    if (authenticated) {
      await queryClient.prefetchQuery({
        queryKey: ['userById', user?.id],
        queryFn: () => getUserById(user?.id!),
      })
    }
  },
  component: () => (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex justify-center w-full">
          <PageLayout />
        </div>
      </div>
      <Toaster position="top-center" />
      <TanStackRouterDevtools />
    </>
  ),
})
