import { Input } from '@/components/ui/input'
import { useGetUserQuery } from '@/hooks/user'
import { Link, useNavigate } from '@tanstack/react-router'
import { FileCog, Newspaper, Search, User } from 'lucide-react'
import { Button } from '../ui/button'

interface HeaderProps {
  onSearchChange: (query: string) => void
  searchQuery: string
  isAdmin: boolean
  onToggleAdmin: () => void
}

export function Header({ onSearchChange, searchQuery }: HeaderProps) {
  const user = useGetUserQuery()
  const navigate = useNavigate()
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex items-center space-x-2 " to="/">
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">JornalismoUBI</h1>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
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
              <Link to="/logout">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link to="/login">
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
