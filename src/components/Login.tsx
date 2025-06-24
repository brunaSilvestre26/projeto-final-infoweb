import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { supabase } from '@/supabase/supabase'
import { useNavigate } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function Login({ className, ...props }: React.ComponentProps<'div'>) {
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
    navigate({ to: '/admin', reloadDocument: true })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Introduza o seu email e password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm flex flex-col items-center gap-1">
              Não tem conta mas quer contribuir para este site?
              <span>
                <a className="text-primary hover:underline" href="mailto:bruna.silvestre@ubi.pt">
                  Contacte-nos
                </a>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
