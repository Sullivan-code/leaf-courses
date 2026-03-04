import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // 🔥 ASSINATURA CRIADA OU ATUALIZADA
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as any;

    // Recuperar clerkId salvo no checkout
    const clerkId = subscription.metadata?.clerkId;

    if (!clerkId) {
      return NextResponse.json({ received: true });
    }

    await prisma.user.update({
      where: { clerkId },
      data: {
        subscriptionStatus: subscription.status,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
      },
    });
  }

  // 🔥 ASSINATURA CANCELADA
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;

    await prisma.user.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        subscriptionStatus: "canceled",
      },
    });
  }

  return NextResponse.json({ received: true });
}