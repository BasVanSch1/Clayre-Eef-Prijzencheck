import ProductCard from "~/components/ProductCard";
import type { Product, User } from "~/components/Types";
import type { Route } from "./+types/product";
import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "react-router";
import { getProduct } from "~/services/productService.server";
import { getUserFromSession } from "~/services/session.server";

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

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  const product = await getProduct(params.code, user?.username ?? undefined);

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  return { product };
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

export default function Product() {
  const loaderData = useLoaderData();
  const product = loaderData.product as Product | null;
  const navigation = useNavigation();

  let isLoading = navigation.state === "loading";

  if (isLoading) {
    return <ProductLoadingPlaceholder />;
  }

  if (loaderData === null) {
    return <NoProductSelected />;
  }

  if (!product) {
    return ErrorBoundary();
  }

  return <ProductCard product={product} />;
}
