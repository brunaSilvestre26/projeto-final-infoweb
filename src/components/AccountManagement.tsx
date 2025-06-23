import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetRolesQuery } from '@/hooks/roles'
import { useGetUsersQuery } from '@/hooks/user'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables } from 'database.types'
import { Edit, Loader2Icon, Lock, Mail, Plus, ShieldUser, Trash2, UserPen } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function AccountManagement() {
  const queryClient = useQueryClient()
  const users = useGetUsersQuery()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState({ open: false, userId: '' })
  const [editingAccount, setEditingAccount] = useState<Tables<'user'> | null>(null)
  const [formData, setFormData] = useState({ name: '', password: '', role: '' })
  const [newAccountData, setNewAccountData] = useState({ email: '', password: '' })
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const roles = useGetRolesQuery()

  const getRoleById = (id: string) => {
    const role = roles.data?.find((role) => role.id === id)
    return role ? role.name : 'Desconhecido'
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const error = signUpNewUser()
    if (error) {
      toast.error('Erro ao criar conta', { description: error })
      return
    }
    setNewAccountData({ email: '', password: '' })
    setIsCreateOpen(false)
    toast.success('Conta criada com sucesso')
  }

  const handleEdit = (e: React.FormEvent, userId: string) => {
    e.preventDefault()
    if (editingAccount) {
      updateUserMutation.mutate({
        user_id: userId,
        name: formData.name,
        role_id: formData.role,
      })
      setIsEditOpen({ open: false, userId: '' })
      setEditingAccount(null)
      setFormData({ name: '', password: '', role: '' })
    }
  }

  const openEditDialog = (user: Tables<'user'>) => {
    setEditingAccount(user)
    setFormData({ name: user.name!, password: '', role: user.role_id! })
    setIsEditOpen({ open: true, userId: user.id! })
  }

  async function signUpNewUser() {
    const { error } = await supabase.auth.signUp({
      email: newAccountData.email,
      password: newAccountData.password,
      options: {
        emailRedirectTo: 'http://localhost:5173/',
      },
    })
    return error?.message
  }

  const updateUserMutation = useMutation({
    mutationFn: async ({ user_id, name, role_id }: { user_id: string; name: string; role_id: string }) => {
      // Update user
      if (name !== '' && role_id !== '') {
        const { error } = await supabase
          .from('user')
          .update({
            name,
            role_id,
          })
          .eq('id', user_id)
        if (error) {
          throw new Error(error.message)
        }
      } else if (name !== '' && role_id === '') {
        const { error } = await supabase
          .from('user')
          .update({
            name,
          })
          .eq('id', user_id)
        if (error) {
          throw new Error(error.message)
        }
      } else if (role_id !== '' && name === '') {
        const { error } = await supabase
          .from('user')
          .update({
            role_id,
          })
          .eq('id', user_id)
        if (error) {
          throw new Error(error.message)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      toast.success('Conta atualizada com sucesso')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar a conta', { description: error.message })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('delete_user', {
        user_id: userId,
      })
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      setOpenDialogId(null) // Fecha o dialog só quando terminar
      toast.success('Conta apagada com sucesso')
    },
    onError: (error) => {
      toast.error('Erro ao apagar a conta', { description: error.message })
    },
    onSettled: () => {
      setOpenDialogId(null)
    },
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
      case 'Reviewer':
        return 'bg-orange-100 text-orange-800'
      case 'Writer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-gray-900">Gerir Contas</h1>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Criar Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Conta</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Introduza o endereço de email"
                    className="px-10 h-12 text-base"
                    value={newAccountData.email}
                    onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Introduza a password"
                    className="px-10 h-12 text-base"
                    value={newAccountData.password}
                    onChange={(e) => setNewAccountData({ ...newAccountData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Conta</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contas</CardTitle>
          <CardDescription>
            {users.data?.length} conta{users.data?.length !== 1 ? 's' : ''} no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Utilizador</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell width={150} className="font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell width={100}>
                    <Badge variant="secondary" className={getRoleBadgeColor(getRoleById(user.role_id!)!)}>
                      {getRoleById(user.role_id!)}
                    </Badge>
                  </TableCell>
                  <TableCell width={150}>
                    {user.created_at
                      ? (() => {
                          const date = new Date(user.created_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell width={150}>
                    {user.updated_at
                      ? (() => {
                          const date = new Date(user.updated_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell width={50} className="text-center">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog
                        open={openDialogId === user.id}
                        onOpenChange={(open) => setOpenDialogId(open ? user.id : null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Tem a certeza que pretende eliminar o utilizador '{user.name}'?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá apagar permanentemente o utilizador selecionado e não pode ser desfeita
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={deleteUserMutation.isPending}
                              onClick={() => setOpenDialogId(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <Button
                              variant="destructive"
                              onClick={() => deleteUserMutation.mutate(user.id!)}
                              disabled={deleteUserMutation.isPending}
                            >
                              {deleteUserMutation.isPending ? <Loader2Icon className="animate-spin" /> : 'Apagar'}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isEditOpen.open} onOpenChange={(value) => setIsEditOpen({ open: value, userId: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Conta</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleEdit(e, isEditOpen.userId)} className="space-y-6">
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
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="title" className="mb-2">
                Tipo de Utilizador
              </Label>
              <div className="relative">
                <ShieldUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      role: value,
                    }))
                  }}
                >
                  <SelectTrigger className="w-[180px] pl-10">
                    <SelectValue placeholder="Fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles.data?.map((role) => (
                        <SelectItem key={role.id} value={role.id!}>
                          {role.name!}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen({ open: false, userId: '' })}>
                Cancelar
              </Button>
              <Button type="submit">Atualizar Conta</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
