import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return (
    <div>
      <h1 className="text-center"> Aqui você encontraa diversos produtos relacionados à Psicologia. </h1>
      <ProductList products={products.data} />
    </div>
  );
}
''