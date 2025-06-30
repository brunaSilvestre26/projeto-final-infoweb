import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useGetRolesQuery } from '@/hooks/roles'
import { useGetUserByIdQuery, useGetUserQuery } from '@/hooks/user'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Calendar, Edit3, Lock, LogOut, Mail, ShieldUser, User, UserPen } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export function ProfilePage() {
  const queryClient = useQueryClient()
  const user = useGetUserQuery()
  const currentUser = useGetUserByIdQuery(user.data?.id || '')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', password: '' })
  const roles = useGetRolesQuery()
  const navigate = useNavigate()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const getRoleById = (id: string) => {
    const role = roles.data?.find((role) => role.id === id)
    return role ? role.name : 'Desconhecido'
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      navigate({ to: '/login', reloadDocument: true })
      toast.success('Sessão terminada com sucesso!')
    } catch (error) {
      toast.error('Erro ao terminar sessão')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserMutation.mutate({
      user_id: currentUser.data?.id || '',
      name: formData.name,
      password: formData.password,
    })
    setIsEditOpen(false)
    setFormData({ name: currentUser.data?.name!, password: '' })
  }

  const updateUserMutation = useMutation({
    mutationFn: async ({ user_id, name, password }: { user_id: string; name: string; password: string }) => {
      // Update user
      if (name !== '' && name !== currentUser.data?.name) {
        const { error } = await supabase
          .from('user')
          .update({
            name,
          })
          .eq('id', user_id)
        if (error) {
          throw new Error(error.message)
        }
      }
      if (password !== '') {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
          throw new Error(error.message)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] })
      queryClient.invalidateQueries({ queryKey: ['userById'] })
      toast.success('Conta atualizada com sucesso')
      navigate({ to: '/perfil', reloadDocument: true })
    },
    onError: (error) => {
      toast.error('Erro ao atualizar a conta', { description: error.message })
    },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="relative flex justify-center items-center">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src="https://openclipart.org/image/800px/346569" />
              </Avatar>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight break-all max-w-xs sm:max-w-sm md:max-w-full">
                {currentUser.data?.name}
              </h1>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">
                  <ShieldUser className="mr-1 h-3 w-3" />
                  {getRoleById(currentUser.data?.role_id || '')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Membro desde{' '}
                  {currentUser.data?.created_at ? new Date(currentUser.data?.created_at).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({ name: currentUser.data?.name!, password: '' })
                setIsEditOpen(true)
              }}
            >
              <Edit3 className="h-4 w-4" />
              Editar Perfil
            </Button>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Conta</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => handleEdit(e)} className="space-y-6">
                  <div>
                    <Label htmlFor="edit-name" className="mb-2">
                      Nome
                    </Label>
                    <div className="relative">
                      <UserPen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />{' '}
                      <Input
                        id="edit-name"
                        type="text"
                        placeholder="Introduza o nome"
                        className="px-10 h-12 text-base"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-password" className="mb-2">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />{' '}
                      <Input
                        id="edit-password"
                        type="password"
                        placeholder="Introduza a nova password"
                        className="px-10 h-12 text-base"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({ name: currentUser.data?.name!, password: '' })
                        setIsEditOpen(false)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Atualizar Conta</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLoggingOut} className="text-white">
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem a certeza que pretende terminar sessão? Terá de iniciar sessão novamente para aceder à sua conta
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/80">
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informação do Utilizador
                </CardTitle>
                <CardDescription>Detalhes da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{currentUser.data?.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Endereço de email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.data?.email}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <label className="text-sm font-medium text-muted-foreground mb-4">Tipo de utilizador</label>
                  <span className="flex items-center gap-2">
                    <ShieldUser className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{getRoleById(currentUser.data?.role_id!)}</span>
                  </span>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Data de criação</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {currentUser.data?.created_at
                          ? new Date(currentUser.data?.created_at).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {' '}
                        {currentUser.data?.updated_at
                          ? new Date(currentUser.data?.updated_at).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent>
              <CardDescription></CardDescription>
              <>
                <p className="text-lg font-medium mb-1">Permissões</p>
                {getRoleById(currentUser.data?.role_id!) === 'Admin' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-4">Acesso completo ao backoffice</p>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Criar artigos
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Gerir todos os artigos
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Gerir utilizadores
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Gerir fontes
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Fazer scraping
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Gerir tags
                    </div>
                  </div>
                )}
                {getRoleById(currentUser.data?.role_id!) === 'Writer' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-4">Acesso limitado ao backoffice</p>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Criar e editar artigos
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Gerir os seus artigos
                    </div>
                  </div>
                )}
                {getRoleById(currentUser.data?.role_id!) === 'Reviewer' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-4">Acesso limitado ao backoffice</p>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Criar artigos
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Gerir todos os artigos
                    </div>
                  </div>
                )}
              </>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
