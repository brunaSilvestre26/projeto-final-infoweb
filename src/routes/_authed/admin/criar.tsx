import { ArticleForm } from '@/components/ArticleForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/criar')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4 w-[700px] mx-auto">
      <ArticleForm />
    </div>
  )
}
