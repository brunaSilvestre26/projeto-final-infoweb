import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useGetUserQuery } from '@/hooks/user'
import { Link, useNavigate } from '@tanstack/react-router'
import { FileCog, Search, User } from 'lucide-react'
import { useState } from 'react'
import { SearchModal } from '../../SearchModal'
import { Button } from '../../ui/button'
import { MobileHeader } from './MobileHeader'

export function Header() {
  const [openModal, setOpenModal] = useState(false)
  const user = useGetUserQuery()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  if (isMobile) {
    return <MobileHeader />
  }

  return (
    <header className="bg-background border-b border-border fixed right-0 left-0 w-full top-0 z-50 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <Link className="flex items-center" to="/">
        <img src="/logoJornalismoUBIpretoEazul.png" alt="Logo" className="h-7" />
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquise em artigos..."
          value=""
          onClick={() => setOpenModal(true)}
          className="pl-10"
        />
        <SearchModal open={openModal} onOpenChange={setOpenModal} />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {user.data && (
          <Button variant="secondary" onClick={() => navigate({ to: '/admin' })}>
            <FileCog className="h-5 w-5" />
            Backoffice
          </Button>
        )}
        {user.data ? (
          <Link to="/perfil">
            <User className="h-5 w-5" />
          </Link>
        ) : (
          <Link to="/login">
            <User className="h-5 w-5" />
          </Link>
        )}
      </div>
    </header>
  )
}
