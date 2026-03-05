import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" }, 
        { status: 500 }
      );
    }

    // Obter headers
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    // Verificar se headers existem
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing svix headers" }, 
        { status: 400 }
      );
    }

    // Obter body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verificar webhook
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

    // Processar evento user.created
    if (eventType === "user.created") {
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
      
      // Pegar primeiro email
      const email = email_addresses?.[0]?.email_address;
      
      if (!email) {
        console.error("No email found for user:", id);
        return NextResponse.json({ received: true });
      }

      // Criar usuário no banco
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: email,
          username: username || email.split('@')[0],
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          image: image_url,
        },
        create: {
          clerkId: id,
          email: email,
          username: username || email.split('@')[0],
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          image: image_url,
          subscriptionStatus: "inactive",
        },
      });

      console.log(`✅ User created: ${id} (${email})`);
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