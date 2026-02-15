"use client";

import { useCartStore } from "../../store/cart-store";

export const CartCount = () => {
  const { items } = useCartStore();

  const cartCount = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  if (cartCount === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {cartCount}
    </span>
  );
};
