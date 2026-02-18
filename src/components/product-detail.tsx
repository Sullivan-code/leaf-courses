"use client";

import Stripe from "stripe";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../../store/cart-store";

interface Props {
  product: Stripe.Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const price = product.default_price as Stripe.Price;

  // check if product exists in cart
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images?.[0] ?? null,
      quantity: 1,
    });
  };

  const onRemoveItem = () => {
    if (cartItem) {
      removeItem(product.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
      {product.images && product.images[0] && (
        <div className="relative h-60 w-full md:w-1/2">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.description && (
          <p className="text-gray-700">{product.description}</p>
        )}

        {price && price.unit_amount && (
          <p className="text-lg font-semibold text-gray-900 mt-2">
            R${(price.unit_amount / 100).toFixed(2)}
          </p>
        )}

        <div className="flex items-center space-x-4 mt-4">
          <Button variant="outline" onClick={onRemoveItem} disabled={quantity === 0}>
            -
          </Button>
          <span className="text-lg font-semibold">{quantity}</span>
          <Button variant="outline" onClick={onAddItem}>
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
