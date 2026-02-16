"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "@/../../store/cart-store";
import { redirect } from "next/navigation";

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const itemsJson = formData.get("items") as string;
  const items: CartItem[] = JSON.parse(itemsJson);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://leaf-courses.vercel.app";

  const line_items = items.map((item) => ({
    price_data: {
      currency: "brl",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price, // em centavos
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${baseUrl}/success`,
    cancel_url: `${baseUrl}/checkout`,
  });

  redirect(session.url!);
};
