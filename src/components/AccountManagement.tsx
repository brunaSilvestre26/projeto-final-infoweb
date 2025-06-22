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
import { Edit, Lock, Mail, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function AccountManagement() {
  const queryClient = useQueryClient()
  const users = useGetUsersQuery()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState({ open: false, userId: '' })
  const [editingAccount, setEditingAccount] = useState<Tables<'user'> | null>(null)
  const [formData, setFormData] = useState({ name: '', password: '', role: '' })
  const [newAccountData, setNewAccountData] = useState({ email: '', password: '' })

  const roles = useGetRolesQuery()

  const getRoleById = (id: string) => {
    const role = roles.data?.find((role) => role.id === id)
    return role ? role.name : 'Desconhecido'
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    signUpNewUser()
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
    await supabase.auth.signUp({
      email: newAccountData.email,
      password: newAccountData.password,
      options: {
        emailRedirectTo: 'http://localhost:5173/',
      },
    })
  }

  const updateUserMutation = useMutation({
    mutationFn: async ({ user_id, name, role_id }: { user_id: string; name: string; role_id: string }) => {
      // Update user
      if (name !== '' && role_id !== '') {
        await supabase
          .from('user')
          .update({
            name,
            role_id,
          })
          .eq('id', user_id)
      } else if (name !== '' && role_id === '') {
        await supabase
          .from('user')
          .update({
            name,
          })
          .eq('id', user_id)
      } else if (role_id !== '' && name === '') {
        await supabase
          .from('user')
          .update({
            role_id,
          })
          .eq('id', user_id)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      toast.success('Conta atualizada com sucesso')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerir Contas</h1>
          <p className="text-gray-500 mt-1">Gestão de contas e autenticação</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Conta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Introduza o endereço de email"
                    className="pl-10"
                    value={newAccountData.email}
                    onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Introduza a password"
                    className="pl-10"
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
                <TableHead>Role</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-medium">{getRoleById(user.role_id!)}</TableCell>
                  <TableCell>
                    {user.created_at
                      ? (() => {
                          const date = new Date(user.created_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell>
                    {user.updated_at
                      ? (() => {
                          const date = new Date(user.updated_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('TODO: Implement delete user functionality')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
            <DialogDescription>
              Faça as alterações necessárias e clique em "Atualizar Conta" para guardar
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleEdit(e, isEditOpen.userId)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Introduza o nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="title" className="mb-2">
                Tipo de Utilizador
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }}
              >
                <SelectTrigger className="w-[180px]">
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
