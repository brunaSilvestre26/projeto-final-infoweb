import { Button } from '@/components/ui/button'
import { supabase } from '@/supabase/supabase'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'

export const Logout = () => {
  const navigate = useNavigate()
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.auth.signOut()
    navigate({ to: '/', reloadDocument: true }) // Redirect to home page after login
  }

  return (
    <div className="p-4 max-w-sm mx-auto border rounded shadow">
      <h2 className="text-xl font-bold mb-4"></h2>

      <Button variant="default" type="submit" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
