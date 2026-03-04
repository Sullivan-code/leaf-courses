import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",

    // Se já existir customer, reutiliza
    customer: user.stripeCustomerId ?? undefined,

    customer_email: user.email,

    metadata: {
      clerkId: user.clerkId,
    },

    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}