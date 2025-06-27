import { useLocation } from '@tanstack/react-router'
import { BackofficeSidebar } from './BackofficeSidebar'
import { PublicSidebar } from './PublicSidebar'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-16 h-screen w-64 bg-background border-r border-border z-30 p-4 overflow-y-auto">
      {location.pathname.startsWith('/admin') ? <BackofficeSidebar /> : <PublicSidebar />}
    </aside>
  )
}
