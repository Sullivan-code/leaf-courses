import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ 
        subscribed: false,
        status: "unauthenticated" 
      });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        subscriptionStatus: true,
        stripeSubscriptionId: true 
      },
    });

    return NextResponse.json({
      subscribed: user?.subscriptionStatus === "active",
      status: user?.subscriptionStatus || "inactive",
      hasSubscription: !!user?.stripeSubscriptionId,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { 
        subscribed: false,
        error: "Internal server error",
        status: "error"
      }, 
      { status: 500 }
    );
  }
}