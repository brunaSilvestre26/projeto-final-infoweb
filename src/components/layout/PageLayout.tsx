import { Outlet } from '@tanstack/react-router'

export function PageLayout() {
  return (
    <div className="w-full max-w-7xl flex justify-center h-fit px-4 mt-4 mb-4">
      <Outlet />
    </div>
  )
}
