import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetSourcesQuery } from '@/hooks/sources'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bot, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Switch } from './ui/switch'

export function SourceManagement() {
  const queryClient = useQueryClient()
  const sources = useGetSourcesQuery()

  const handleEdit = (sourceId: string, is_active: boolean) => {
    updateSourceStateMutation.mutate({
      source_id: sourceId,
      is_active: is_active,
    })
  }

  const handleClick = () => {
    runScrapingMutation.mutate()
  }

  const runScrapingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('source')
        .update({ last_scraped_at: new Date().toISOString() })
        .eq('is_active', true)
      if (error) {
        throw new Error(error.message)
      }

      const response = await fetch('http://localhost:5000/run-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tubi: sources.data?.find((source) => source.name === 'tubi')?.is_active || false,
          rubi: sources.data?.find((source) => source.name === 'rubi')?.is_active || false,
          urbi: sources.data?.find((source) => source.name === 'urbietorbi')?.is_active || false,
        }),
      })
      return response.json()
    },
    onSuccess: () => {
      toast.success('Scraping realizado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
    onError: (error) => {
      toast.error('Erro ao realizar scraping', { description: error.message })
    },
  })

  const updateSourceStateMutation = useMutation({
    mutationFn: async ({ source_id, is_active }: { source_id: string; is_active: boolean }) => {
      // Update source state
      const { error } = await supabase
        .from('source')
        .update({
          is_active: is_active,
        })
        .eq('id', source_id)
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
      toast.success('Estado da fonte atualizado com sucesso')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar o estado da fonte', { description: error.message })
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Gerir Fontes</h1>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleClick}
          disabled={runScrapingMutation.isPending}
        >
          <Bot size={32} strokeWidth={2.25} />
          {runScrapingMutation.isPending ? <Loader2Icon className="animate-spin" /> : 'Fazer web scraping'}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fontes</CardTitle>
          <CardDescription>
            {sources.data?.length} fonte{sources.data?.length !== 1 ? 's' : ''} no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado atualizado</TableHead>
                <TableHead>Último scrape</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.data?.map((source) => (
                <TableRow key={source.id}>
                  <TableCell width={150} className="font-medium">
                    {source.name}
                  </TableCell>
                  <TableCell width={200}>{source.url}</TableCell>
                  <TableCell width={100}>{source.type}</TableCell>
                  <TableCell width={150}>
                    {source.updated_at
                      ? (() => {
                          const date = new Date(source.updated_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell width={150}>
                    {source.last_scraped_at
                      ? (() => {
                          const date = new Date(source.last_scraped_at)
                          const pad = (n: number) => n.toString().padStart(2, '0')
                          return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
                        })()
                      : ''}
                  </TableCell>
                  <TableCell width={50} className="text-center">
                    <div className="space-x-2">
                      <Switch
                        checked={source.is_active}
                        onCheckedChange={(value) => handleEdit(source.id, value)}
                        disabled={updateSourceStateMutation.isPending}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
