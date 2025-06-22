import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useGetArticleByIdQuery } from '@/hooks/articles'
import { useGetAuthorsQuery } from '@/hooks/authors'
import { useGetRoleByIdQuery } from '@/hooks/roles'
import { useGetTags } from '@/hooks/tags'
import { useGetUserByIdQuery, useGetUserQuery } from '@/hooks/user'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Tables } from 'database.types'
import { Eye, EyeOff, Save, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const DEFAULT_IMAGE_URL = 'https://eduportugal.eu/wp-content/uploads/2023/11/UBI-logo-pg-geral.png'

interface ArticleFormData {
  title: string
  summary: string
  content: string
  image_url: string
  status: Tables<'article'>['status']
  authors: { id: string; name: string }[]
  tags: { id: string; name: string }[]
}

interface ArticleFormProps {
  isEditing?: boolean
  articleId?: string
}

export function ArticleForm({ isEditing, articleId }: ArticleFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    status: 'pending',
    authors: [],
    tags: [],
  })

  const [showPreview, setShowPreview] = useState(isEditing ? true : false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const user = useGetUserQuery()
  const userById = useGetUserByIdQuery(user.data?.id!)
  const currentUserRole = useGetRoleByIdQuery(userById.data?.role_id!)

  // Fetch authors
  const authors = useGetAuthorsQuery()

  // Fetch tags
  const tags = useGetTags()

  // Fetch article for editing
  const article = useGetArticleByIdQuery(articleId || undefined)

  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      // Insert article
      const { data: articleData, error: articleError } = await supabase
        .from('article')
        .insert({
          title: data.title,
          summary: data.summary,
          content: data.content,
          image_url: data.image_url === '' ? DEFAULT_IMAGE_URL : data.image_url,
          status: 'pending',
        })
        .select()
        .single()

      if (articleError) throw articleError

      // Insert article_authors relationships
      if (data.authors.length > 0) {
        const { error: authorsError } = await supabase.from('article_authors').insert(
          data.authors.map((author) => ({
            article_id: articleData.id,
            author_id: author.id,
          }))
        )

        if (authorsError) throw authorsError
      }

      // Insert article_tags relationships
      if (data.tags.length > 0) {
        const { error: tagsError } = await supabase.from('article_tags').insert(
          data.tags.map((tag) => ({
            article_id: articleData.id,
            tag_id: tag.id,
          }))
        )

        if (tagsError) throw tagsError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedArticles'] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      navigate({ to: '/admin' })
    },
  })

  // Update article mutation
  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      if (!articleId) throw new Error('No article ID')

      // Update article
      const { error: articleError } = await supabase
        .from('article')
        .update({
          title: data.title,
          summary: data.summary,
          content: data.content,
          image_url: data.image_url === '' ? DEFAULT_IMAGE_URL : data.image_url,
          status: currentUserRole.data?.name === 'writer' ? 'pending' : formData.status,
        })
        .eq('id', articleId)

      if (articleError) throw articleError

      // Delete existing relationships
      await supabase.from('article_authors').delete().eq('article_id', articleId)
      await supabase.from('article_tags').delete().eq('article_id', articleId)

      // Insert new article_authors relationships
      if (data.authors.length > 0) {
        const { error: authorsError } = await supabase.from('article_authors').insert(
          data.authors.map((author) => ({
            article_id: articleId,
            author_id: author.id,
          }))
        )

        if (authorsError) throw authorsError
      }

      // Insert new article_tags relationships
      if (data.tags.length > 0) {
        const { error: tagsError } = await supabase.from('article_tags').insert(
          data.tags.map((tag) => ({
            article_id: articleId,
            tag_id: tag.id,
          }))
        )

        if (tagsError) throw tagsError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedArticles'] })
      queryClient.invalidateQueries({ queryKey: ['article', articleId] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      setShowPreview(true)
    },
  })

  // Load article data for editing
  useEffect(() => {
    if (article.data) {
      setFormData({
        title: article.data.title || '',
        summary: article.data.summary || '',
        content: article.data.content || '',
        image_url: article.data.image_url || DEFAULT_IMAGE_URL,
        status: article.data.status || 'pending',
        authors:
          article.data.article_authors?.map((author) => ({
            id: author.author_id,
            name: author.name ?? '',
          })) || [],
        tags:
          article.data.article_tags?.map((tag) => ({
            id: tag.tag_id,
            name: tag.name ?? '',
          })) || [],
      })
    }
  }, [article.data])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório'
    if (!formData.summary.trim()) newErrors.summary = 'Sumário é obrigatório'
    if (!formData.content.trim()) newErrors.content = 'Conteúdo é obrigatório'
    if (formData.authors.length === 0) newErrors.authors = 'Pelo menos um autor é obrigatório'
    if (formData.tags.length === 0) newErrors.tags = 'Pelo menos uma tag é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (isEditing) {
        updateArticleMutation.mutate(formData)
      } else {
        createArticleMutation.mutate(formData)
      }
    }
  }

  const handleCancel = () => {
    navigate({ to: '/admin' })
  }

  const handleRemoveAuthor = (authorId: string) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author.id !== authorId),
    }))
  }

  const handleRemoveTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagId),
    }))
  }

  const getAuthorName = (authorId: string) => {
    return authors.data?.find((a) => a.id === authorId)?.name || 'Unknown Author'
  }

  const getTagName = (tagId: string) => {
    return tags.data?.find((t) => t.id === tagId)?.name || 'Unknown Tag'
  }

  if (authors.isLoading || tags.isLoading || (isEditing && article.isLoading)) {
    return <div className="w-full flex justify-center">A carregar...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</CardTitle>
          <div className="flex items-center space-x-3">
            <Button type="button" variant="outline" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Editar' : 'Pré-visualizar'}
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <X className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sair</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showPreview ? (
          <div className="prose max-w-none">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground -mt-4 mb-4">
              <span>•</span>
              <span>
                Estado:{' '}
                {formData.status === 'approved'
                  ? 'Aprovado'
                  : formData.status === 'rejected'
                    ? 'Rejeitado'
                    : 'Pendente'}
              </span>
            </div>

            {formData.image_url && (
              <img src={formData.image_url} alt={formData.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-3xl font-bold mb-4">{formData.title || 'Título vai aparecer aqui'}</h1>

            <CardDescription>{formData.summary || 'O sumário do artigo vai aparecer aqui...'}</CardDescription>
            <p className="text-lg text-muted-foreground font-medium mb-6"></p>
            <div className="text-foreground whitespace-pre-wrap">
              {formData.content || 'O conteúdo do artigo vai aparecer aqui...'}
            </div>
            {formData.authors.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold mb-3">Autores</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.authors.map((author) => (
                    <Badge key={author.id} variant="secondary">
                      {getAuthorName(author.id)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {formData.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {getTagName(tag.id)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentUserRole.data?.name !== 'Writer' && (
                <div>
                  <Label htmlFor="title" className="mb-2">
                    Estado
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        status: value as Tables<'article'>['status'],
                      }))
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="lg:col-span-2">
                <Label htmlFor="title" className="mb-2">
                  Título *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Iserir título aqui..."
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="summary" className="mb-2">
                  Sumário *
                </Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="Breve sumário do artigo..."
                  className={`min-h-[100px] ${errors.summary ? 'border-destructive' : ''}`}
                />
                {errors.summary && <p className="mt-1 text-sm text-destructive">{errors.summary}</p>}
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="content" className="mb-2">
                  Conteúdo *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Conteúdo do artigo completo..."
                  className={`min-h-[300px] ${errors.content ? 'border-destructive' : ''}`}
                />
                {errors.content && <p className="mt-1 text-sm text-destructive">{errors.content}</p>}
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="image_url" className="mb-2">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Authors Section */}
              <div className="lg:col-span-2">
                <Label className="mb-2">Autores *</Label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const selectedAuthor = authors.data?.find((author) => author.id === value)
                        if (selectedAuthor && !formData.authors.some((author) => author.id === selectedAuthor.id)) {
                          setFormData((prev) => ({
                            ...prev,
                            authors: [...prev.authors, selectedAuthor],
                          }))
                        }
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecionar um autor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.data
                          ?.filter((author) => !formData.authors.includes({ id: author.id, name: author.name }))
                          .map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.authors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.authors.map((author) => (
                        <Badge
                          key={author.id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveAuthor(author.id)}
                        >
                          {getAuthorName(author.id)} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              <div className="lg:col-span-2">
                <Label className="mb-2">Tags *</Label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const selectedTag = tags.data?.find((tag) => tag.id === value)
                        if (selectedTag) {
                          setFormData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, selectedTag],
                          }))
                        }
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecionar uma categoria existente..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.data
                          ?.filter((tag) => !formData.tags.includes({ id: tag.id, name: tag.name }))
                          .map((tag) => (
                            <SelectItem key={tag.id} value={tag.id}>
                              {tag.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag.id)}
                        >
                          {getTagName(tag.id)} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={createArticleMutation.isPending || updateArticleMutation.isPending}>
                <Save className="h-4 w-4" />
                {isEditing ? 'Atualizar Artigo' : 'Criar Artigo'}
                {(createArticleMutation.isPending || updateArticleMutation.isPending) && '...'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
