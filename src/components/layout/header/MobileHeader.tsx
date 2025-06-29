import { useGetUserQuery } from '@/hooks/user'
import { Link, useLocation } from '@tanstack/react-router'
import { FileCog, House, Search, User } from 'lucide-react'
import { useState } from 'react'
import { SearchModal } from '../../SearchModal'
import { MobileBackofficeSidebar } from '../sidebar/MobileBackofficeSidebar'
import { MobilePublicSidebar } from '../sidebar/MobilePublicSidebar'

export function MobileHeader() {
  const [openModal, setOpenModal] = useState(false)
  const user = useGetUserQuery()
  const location = useLocation()

  return (
    <>
      <header className="bg-background border-b border-border fixed top-0 w-full z-50 flex items-center justify-between pl-6 h-16">
        <Link className="flex items-center" to="/">
          <img src="/logoJornalismoUBIpretoEazul.png" alt="Logo" className="h-7" />
        </Link>

        {location.pathname.startsWith('/admin') && <span className="text-muted-foreground">Backoffice</span>}

        <div className="mr-4">
          {location.pathname.startsWith('/admin') ? <MobileBackofficeSidebar /> : <MobilePublicSidebar />}
        </div>
      </header>
      <footer className="bg-background border-t border-border fixed bottom-0 w-full z-50 flex items-center justify-evenly h-16">
        <Link to="/">
          <House />
        </Link>

        <div>
          <Search onClick={() => setOpenModal(true)} />
          <SearchModal open={openModal} onOpenChange={setOpenModal} />
        </div>

        {/* Actions */}
        {user.data && (
          <Link to="/admin">
            <FileCog className="cursor-pointer" />
          </Link>
        )}

        {user.data ? (
          <Link to="/profile">
            <User />
          </Link>
        ) : (
          <Link to="/login">
            <User />
          </Link>
        )}
      </footer>
    </>
  )
}
