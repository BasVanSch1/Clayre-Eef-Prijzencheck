import ProductsTable from "~/components/ProductsTable";
import type { Route } from "./+types/products";
import { Await, useLoaderData } from "react-router";
import { Suspense } from "react";
import { getProducts } from "~/services/productService.server";

export const handle = {
  title: "Products",
};

export async function loader({ request }: Route.LoaderArgs) {
  return { products: getProducts() };
}

export function HydrateFallback() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md">
        <div className="text-lg text-center font-mono">Loading products...</div>
      </div>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "All Products" },
    { name: "description", content: "A list with all products" },
  ];
}

export default function Products() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  return (
    <div className="col-start-3 row-start-3 mt-5 flex flex-col">
      <Suspense fallback={<HydrateFallback />}>
        <Await resolve={loaderData.products}>
          {(products) => <ProductsTable data={products} />}
        </Await>
      </Suspense>
    </div>
  );
}
