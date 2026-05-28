export default async function NotePage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params

  return (
    <div>
    </div>
  )
}
