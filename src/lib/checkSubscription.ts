// lib/checkSubscription.ts

import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function checkSubscription() {
  const user = await currentUser()

  if (!user) {
    return { authorized: false }
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id }
  })

  if (!dbUser || dbUser.subscriptionStatus !== "active") {
    return { authorized: false }
  }

  return { authorized: true }
}