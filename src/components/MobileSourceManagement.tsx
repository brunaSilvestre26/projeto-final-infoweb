import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useGetSourcesQuery } from '@/hooks/sources'
import { supabase } from '@/supabase/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bot, Calendar, ExternalLink, FileText, Globe, Loader2Icon, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Switch } from './ui/switch'

export function MobileSourceManagement() {
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
              <CardTitle className="text-2xl font-bold text-gray-900">Gerir Fontes</CardTitle>
              <CardDescription>
                {sources.data?.length} fonte{sources.data?.length !== 1 ? 's' : ''} no total
              </CardDescription>
            </div>
            <Button className="bg-blue-600 " onClick={handleClick} disabled={runScrapingMutation.isPending}>
              <Bot size={32} strokeWidth={2.25} />
              {runScrapingMutation.isPending ? <Loader2Icon className="animate-spin" /> : ''}
            </Button>
          </div>
        </CardContent>
      </Card>

      {sources.data?.map((source) => (
        <Card key={source.id} className="shadow-sm border-0 bg-white">
          <CardContent>
            <CardDescription></CardDescription>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 max-w-xs sm:max-w-sm md:max-w-full flex-1 flex items-center">
                  <Globe className="h-5 w-5 text-primary mr-2" /> {source.name}
                </h3>
                <div className="space-x-2">
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={(value) => handleEdit(source.id, value)}
                    disabled={updateSourceStateMutation.isPending}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Url: </span>
                <span>{source.url}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Tipo:</span>
                <span>{source.type}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Estado atualizado:</span>
                <span>{source.updated_at ? formatDateTime(source.updated_at) : ''}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Último scrape:</span>
                <span>{source.last_scraped_at ? formatDateTime(source.last_scraped_at) : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
