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
        {location.pathname.startsWith('/admin') ? (
          <Link className="flex items-center" to="/admin">
            <img src="/logoJornalismoUBIbackoffice.png" alt="Logo" className="h-7" />
          </Link>
        ) : (
          <Link className="flex items-center" to="/">
            <img src="/logoJornalismoUBIpretoEazul.png" alt="Logo" className="h-7" />
          </Link>
        )}

        <div className="mr-4">
          {location.pathname.startsWith('/admin') ? <MobileBackofficeSidebar /> : <MobilePublicSidebar />}
        </div>
      </header>
      <footer className="bg-background border-t border-border fixed bottom-0 w-full z-50 flex items-center justify-evenly h-16">
        <Link to="/">
          <House className={location.pathname === '/' ? 'text-primary' : ''} />
        </Link>

        <div>
          <Search onClick={() => setOpenModal(true)} className={openModal ? 'text-primary' : ''} />
          <SearchModal open={openModal} onOpenChange={setOpenModal} />
        </div>

        {/* Actions */}
        {user.data && (
          <Link to="/admin">
            <FileCog className={location.pathname.startsWith('/admin') ? 'text-primary' : ''} />
          </Link>
        )}

        {user.data ? (
          <Link to="/perfil">
            <User className={location.pathname === '/perfil' ? 'text-primary' : ''} />{' '}
          </Link>
        ) : (
          <Link to="/login">
            <User className={location.pathname === '/login' ? 'text-primary' : ''} />
          </Link>
        )}
      </footer>
    </>
  )
}
