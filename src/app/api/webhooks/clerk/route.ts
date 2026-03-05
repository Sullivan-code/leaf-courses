import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not configured");
    }

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing svix headers" }, 
        { status: 400 }
      );
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json(
        { error: "Webhook verification failed" }, 
        { status: 400 }
      );
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
      
      // Criar usuário no banco
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email_addresses[0]?.email_address,
          username: username || email_addresses[0]?.email_address.split('@')[0],
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          image: image_url,
          subscriptionStatus: "inactive",
        },
      });

      console.log(`✅ User created: ${id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" }, 
      { status: 500 }
    );
  }
}