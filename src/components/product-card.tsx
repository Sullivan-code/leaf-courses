"use client";

import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  product: Stripe.Product;
}

export const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;

  const handleBuyClick = () => {
    window.location.href =
      "https://buy.stripe.com/8x2eVeadW6Qq86RcCBcQU01";
  };

  return (
    <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-200 gap-0 bg-white rounded-2xl">
      {product.images && product.images[0] && (
        <div className="relative h-60 w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity duration-300 rounded-t-2xl"
          />
        </div>
      )}

      <CardHeader className="p-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        {product.description && (
          <p className="text-gray-600 text-sm mb-2">
            {product.description}
          </p>
        )}

        {price && price.unit_amount && (
          <p className="text-lg font-semibold text-gray-900">
            R${(price.unit_amount / 100).toFixed(2)}
          </p>
        )}

        <Button
          onClick={handleBuyClick}
          className="
            mt-4
            w-full
            flex items-center justify-center
            px-8 py-3
            bg-gradient-to-r from-blue-500 to-purple-600
            text-white
            text-lg
            rounded-xl
            shadow-lg
            transition-all duration-300
            hover:from-purple-600 hover:to-purple-800
            hover:scale-105
            active:scale-95
          "
        >
          Comprar
        </Button>

        <Button
          className="
            mt-4
            w-full
            flex items-center justify-center
            px-8 py-3
            bg-gray-200
            text-gray-800
            text-lg
            rounded-xl
            shadow-md
            transition-all duration-300
            hover:bg-gray-300
          "
        >
          Aula Experimental
        </Button>
      </CardContent>
    </Card>
  );
};
