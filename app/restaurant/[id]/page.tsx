import { redirect } from 'next/navigation'

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/customer/restaurant/${id}`)
}
