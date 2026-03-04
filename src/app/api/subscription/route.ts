import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ subscribed: false });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return NextResponse.json({
    subscribed: user?.subscriptionStatus === "active",
  });
}