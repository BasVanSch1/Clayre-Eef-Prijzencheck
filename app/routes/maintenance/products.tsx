import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/products";

export const handle = {
  title: "Maintenance > Products",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Product Maintenance" },
    { name: "description", content: "Prijzencheck Product Maintenance" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.products"
  );
}

export default function Products() {
  return (
    <>
      <div className="row-start-2 md:col-start-2 md:row-start-1 grid grid-cols-1 grid-rows-3">
        <h1 className="row-start-1 col-start-1 text-gray-700 text-lg font-semibold text-center bg-blue-300/80 rounded-lg p-2 shadow">
          Page under construction
        </h1>
      </div>
    </>
  );
}
