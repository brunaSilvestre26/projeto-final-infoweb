import { ArticleForm } from '@/components/ArticleForm'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/edit/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { articleId } = useParams({ from: '/_authed/admin/edit/$articleId' })
  return (
    <div className="p-4 w-[700px] mx-auto">
      <ArticleForm articleId={articleId} isEditing={true} />
    </div>
  )
}
