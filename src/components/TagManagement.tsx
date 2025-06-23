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
import { useGetTagsQuery } from '@/hooks/tags'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables } from 'database.types'
import { Edit, Loader2Icon, Plus, Tag, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export function TagManagement() {
  const queryClient = useQueryClient()
  const tags = useGetTagsQuery()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState({ open: false, tagId: '' })
  const [editingTag, setEditingTag] = useState<Tables<'tag'> | null>(null)
  const [editTagName, setEditTagName] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createTagMutation.mutate({ name: newTagName })
    setNewTagName('')
    setIsCreateOpen(false)
  }

  // create a new tag
  const createTagMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const { error } = await supabase.from('tag').insert({
        name,
        slug: name.replace(/\s+/g, '-').toLowerCase(),
      })
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag criada com sucesso')
    },
    onError: (error) => {
      toast.error('Erro ao criar a tag', { description: error.message })
    },
  })

  const handleEdit = (e: React.FormEvent, tagId: string) => {
    e.preventDefault()
    if (editingTag) {
      updateTagMutation.mutate({
        tag_id: tagId,
        name: editTagName,
      })
      setIsEditOpen({ open: false, tagId: '' })
      setEditingTag(null)
      setEditTagName('')
    }
  }

  const updateTagMutation = useMutation({
    mutationFn: async ({ tag_id, name }: { tag_id: string; name: string }) => {
      // Update tag
      const { error } = await supabase
        .from('tag')
        .update({
          name,
          slug: name.replace(/\s+/g, '-').toLowerCase(),
        })
        .eq('id', tag_id)
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag atualizada com sucesso')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar a tag', { description: error.message })
    },
  })

  const openEditDialog = (tag: Tables<'tag'>) => {
    setEditingTag(tag)
    setEditTagName(tag.name)
    setIsEditOpen({ open: true, tagId: tag.id! })
  }

  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase.from('tag').delete().eq('id', tagId)
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setOpenDialogId(null) // Fecha o dialog só quando terminar
      toast.success('Tag apagada com sucesso')
    },
    onError: (error) => {
      toast.error('Erro ao apagar a tag', { description: error.message })
    },
    onSettled: () => {
      setOpenDialogId(null)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-gray-900">Gerir Tags</h1>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Criar Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tag</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <Label htmlFor="tagName" className="mb-2">
                  Nome
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="tagName"
                    type="text"
                    placeholder="Introduza o nome da tag"
                    className="px-10 h-12 text-base"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Tag</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            {tags.data?.length} tag{tags.data?.length !== 1 ? 's' : ''} no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.data?.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell width={150} className="font-medium">
                    {tag.name}
                  </TableCell>

                  <TableCell width={150}>
                    {tag.created_at
                      ? (() => {
                          const date = new Date(tag.created_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell width={150}>
                    {tag.updated_at
                      ? (() => {
                          const date = new Date(tag.updated_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell width={50} className="text-center">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(tag)}>
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog
                        open={openDialogId === tag.id}
                        onOpenChange={(open) => setOpenDialogId(open ? tag.id : null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem a certeza que pretende eliminar a tag '{tag.name}'?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá apagar permanentemente a tag selecionada e não pode ser desfeita
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={deleteTagMutation.isPending}
                              onClick={() => setOpenDialogId(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <Button
                              variant="destructive"
                              onClick={() => deleteTagMutation.mutate(tag.id!)}
                              disabled={deleteTagMutation.isPending}
                            >
                              {deleteTagMutation.isPending ? <Loader2Icon className="animate-spin" /> : 'Apagar'}
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
      <Dialog open={isEditOpen.open} onOpenChange={(value) => setIsEditOpen({ open: value, tagId: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tag</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleEdit(e, isEditOpen.tagId)} className="space-y-6">
            <div>
              <Label htmlFor="edit-tag-name" className="mb-2">
                Nome
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />{' '}
                <Input
                  id="edit-tag-name"
                  type="text"
                  placeholder="Introduza o nome da Tag"
                  className="px-10 h-12 text-base"
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen({ open: false, tagId: '' })}>
                Cancelar
              </Button>
              <Button type="submit">Atualizar Tag</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
