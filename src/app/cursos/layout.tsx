import { redirect } from "next/navigation"
import { checkSubscription } from "@/lib/checkSubscription"

export default async function CursoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { authorized } = await checkSubscription()

  if (!authorized) {
    redirect("/pricing")
  }

  return <>{children}</>
}