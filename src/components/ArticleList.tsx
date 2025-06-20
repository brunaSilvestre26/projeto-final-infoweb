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
import { ArticlesType } from '@/hooks/articles'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2Icon, SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export const ArticleList = ({ articles, isBackoffice = false }: { articles: ArticlesType; isBackoffice?: boolean }) => {
  const queryClient = useQueryClient()
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  /**
   * Se for writer:
   * - Ver artigos aprovados escritos pelo writer -FEITO (falta filtrar)
   * - Ver artigos pendentes escritos pelo writer -FEITO (falta filtrar)
   * - Botão para editar artigo
   * - Botão para apagar artigo
   *
   * Se for reviewer ou admin:
   * - Ver artigos escritos por todos os writers
   * - Ver artigos pendentes escritos por todos os writers
   * - Botão para editar artigo
   * - Botão para apagar artigo
   */

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('article').delete().eq('id', id)
      queryClient.invalidateQueries({ queryKey: ['articlesByAuthorId'] })
    },
    onSuccess: () => {
      toast.success('Artigo apagado com sucesso')
      setOpenDialogId(null) // Fecha o dialog só quando terminar
    },
    onError: () => {
      toast.error('Erro ao apagar artigo')
    },
    onSettled: () => {
      setOpenDialogId(null)
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {articles?.map((article) => (
        <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden" key={article.id}>
          {article.image_url && (
            <div className="aspect-video overflow-hidden -mt-6">
              <img
                src={article.image_url}
                alt={article.title || 'Imagem do artigo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <CardHeader>
            {isBackoffice && (
              <div className="flex justify-between items-center my-2">
                <Badge
                  variant={
                    article.status === 'approved'
                      ? 'default'
                      : article.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {article.status === 'approved' ? 'Aprovado' : article.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                </Badge>
                <div className="flex gap-2">
                  <Link
                    to="/admin/edit/$articleId"
                    params={{ articleId: article.id }}
                    className="hover:scale-110 transform active:scale-100 transition-transform cursor-pointer text-primary"
                  >
                    {/*TODO: edit article page*/}
                    <SquarePen size={20} />
                  </Link>
                  <AlertDialog
                    open={openDialogId === article.id}
                    onOpenChange={(open) => setOpenDialogId(open ? article.id : null)}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        className="hover:scale-110 transform active:scale-100 transition-transform cursor-pointer"
                        onClick={() => setOpenDialogId(article.id)}
                      >
                        <Trash2 size={20} color="#ff0000" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Tem a certeza que pretende eliminar o artigo '{article.title}'?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá apagar permanentemente o artigo selecionado e não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={deleteArticleMutation.isPending}
                          onClick={() => setOpenDialogId(null)}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => deleteArticleMutation.mutate(article.id)}
                          disabled={deleteArticleMutation.isPending}
                        >
                          {deleteArticleMutation.isPending ? <Loader2Icon className="animate-spin" /> : 'Apagar'}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}

            <Link to="/$articleId" params={{ articleId: article.id }}>
              <CardTitle className="group-hover:text-primary mb-6">{article.title}</CardTitle>
              <CardDescription>{article.summary}</CardDescription>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">
              {article.article_authors?.length === 1 ? 'Autor' : 'Autores'}:{' '}
              {article.article_authors
                ?.map((a) => a.name)
                .filter(Boolean)
                .join(', ') || 'Desconhecido'}
            </div>
            <div className="flex flex-wrap gap-2">
              {article.article_tags?.map((tag) =>
                tag.name ? (
                  <span key={tag.tag_id} className="bg-muted px-2 py-1 rounded text-xs">
                    {tag.name}
                  </span>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
