import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "react-router";
import type { Route } from "./+types/productEan";
import ProductCard from "~/components/ProductCard";
import { endpoints } from "~/globals";

// Metadata like page title and description
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product details" },
    { name: "description", content: "Product details" },
  ];
}

// Handle function that provides the page title for the header
export const handle = {
  title: "Product details",
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md dark:shadow dark:shadow-purple-600 dark:bg-neutral-700">
        <div className="text-lg text-center font-mono dark:text-neutral-300">
          {error.status}
        </div>
        <div className="text-sm text-center font-mono dark:text-neutral-300">
          {error.data}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md dark:shadow dark:shadow-purple-600 dark:bg-neutral-700">
      <div className="text-lg text-center font-mono dark:text-neutral-300">
        Unexpected Error
      </div>
      <div className="text-sm text-center font-mono dark:text-neutral-300">
        Something went wrong
      </div>
    </div>
  );
}

export function ProductLoadingPlaceholder() {
  return (
    <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md dark:shadow dark:shadow-purple-600 dark:bg-neutral-700">
      <div className="text-lg text-center font-mono dark:text-neutral-300">
        Loading product...
      </div>
    </div>
  );
}

export function NoProductSelected() {
  return (
    <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md dark:shadow dark:shadow-purple-600 dark:bg-neutral-700">
      <div className="text-lg text-center font-mono dark:text-neutral-300">
        No product selected
      </div>
    </div>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  const eanCode: string = params.eanCode;
  if (!eanCode) {
    console.error("EAN code is missing in the parameters.");
    return null;
  }

  const res = await fetch(`${endpoints.products.getByEan}/${eanCode}`);
  // console.log(
  //   `Fetching product with EAN code: ${eanCode}; Status: ${res.status}`
  // );

  if (!res.ok) {
    switch (res.status) {
      case 404:
        throw new Response("Product not found", { status: 404 });
      case 500:
        throw new Response("Internal server error", { status: 500 });
      default:
        throw new Response("An unexpected error occurred", {
          status: res.status,
        });
    }
  }

  return await res.json();
}

export default function ProductEan() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];
  const navigation = useNavigation();

  let isLoading = navigation.state === "loading";

  if (isLoading) {
    return <ProductLoadingPlaceholder />;
  }

  if (loaderData === null) {
    return <NoProductSelected />;
  }

  return (
    <ProductCard
      productCode={loaderData.productCode}
      description={loaderData.description}
      price={loaderData.price}
      imageUrl={loaderData.imageUrl}
      eanCode={loaderData.eanCode}
    />
  );
}
