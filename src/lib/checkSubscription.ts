import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function checkSubscription() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return { authorized: false, error: "No user found" }
    }
    
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { subscriptionStatus: true }
    })
    
    if (!dbUser) {
      return { authorized: false, error: "User not found in database" }
    }
    
    return { 
      authorized: dbUser.subscriptionStatus === "active",
      status: dbUser.subscriptionStatus 
    }
  } catch (error) {
    console.error("Error checking subscription:", error)
    return { authorized: false, error: "Internal server error" }
  }
}