import { useLocation } from '@tanstack/react-router'
import { BackofficeSidebar } from './BackofficeSidebar'
import { PublicSidebar } from './PublicSidebar'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden sm:fixed sm:left-0 sm:top-16 sm:h-screen sm:w-64 sm:bg-background sm:border-r sm:border-border sm:z-30 sm:p-4 sm:overflow-y-auto sm:block">
      {location.pathname.startsWith('/admin') ? <BackofficeSidebar /> : <PublicSidebar />}
    </aside>
  )
}
