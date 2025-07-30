import type { Route } from "./+types/productIndex";
import { NoProductSelected } from "./product";

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

export default function ProductIndex() {
  return <NoProductSelected />;
}
