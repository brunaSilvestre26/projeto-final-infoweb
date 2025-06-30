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
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
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
import { useGetTagsQuery } from '@/hooks/tags'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables } from 'database.types'
import { Calendar, Clock, Edit, Loader2Icon, Plus, Tag, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export function MobileTagManagement() {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Gerir Tags</CardTitle>
              <CardDescription>
                {tags.data?.length} tag{tags.data?.length !== 1 ? 's' : ''} no total
              </CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600">
                  <Plus className="w-4 h-4" />
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
        </CardContent>
      </Card>
      {tags.data?.map((tag) => (
        <Card key={tag.id} className="shadow-sm border-0 bg-white">
          <CardContent>
            <CardDescription></CardDescription>
            <div className="flex items-start justify-between mb-4">
              <h3 className="flex-1 text-lg font-semibold text-gray-900 mb-2 break-all max-w-xs sm:max-w-sm md:max-w-full">
                {tag.name}
              </h3>

              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(tag)} className="h-10 w-10 p-0">
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog
                  open={openDialogId === tag.id}
                  onOpenChange={(open) => setOpenDialogId(open ? tag.id : null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 h-10 w-10 p-0">
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
                      <AlertDialogCancel disabled={deleteTagMutation.isPending} onClick={() => setOpenDialogId(null)}>
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
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Criada:</span>
                <span>{tag.created_at ? formatDateTime(tag.created_at) : ''}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Atualizada:</span>
                <span>{tag.updated_at ? formatDateTime(tag.updated_at) : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
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
