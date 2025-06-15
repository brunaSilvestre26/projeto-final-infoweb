import { Button } from '@/components/ui/button'
import { supabase } from '@/supabase/supabase'
import { useNavigate } from '@tanstack/react-router'
import React, { useState } from 'react'

import { CircleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Label } from './ui/label'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const signInWithEmail = async () => {
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    return response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const signInData = await signInWithEmail()
    if (signInData.error) {
      toast('Erro ao iniciar sessão', {
        description: `Descrição: ${signInData.error.message}`,
        icon: <CircleAlert color="red" />,
      })
      return
    }
    navigate({ to: '/', reloadDocument: true }) // Redirect to home page after login
  }

  return (
    <div className="p-4 w-[500px] mx-auto border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            className="w-full p-2 border rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button variant="default" type="submit">
          Entrar
        </Button>
      </form>
    </div>
  )
}
