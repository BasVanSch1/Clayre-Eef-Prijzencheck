import type { Route } from "./+types/maintenance";
import { requirePermission } from "~/services/auth.server";
import { ProductIcon, SearchIcon, UserIcon } from "~/components/Icons";

export const handle = {
  title: "Maintenance",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Maintenance" },
    { name: "description", content: "Prijzencheck Maintenance" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(
    request,
    "prijzencheck.pages.maintenance"
  );

  return null;
}

export default function Maintenance() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5 w-[80vw]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/*  */}
        <div className="flex flex-col bg-gradient-to-t from-blue-300/80 from-5% via-blue-300 to-blue-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-blue-400/60 mt-2 p-2 shadow">
            <ProductIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Products
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">13,726</p>
        </div>

        <div className="flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Lookups
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">7,251</p>
        </div>

        <div className="flex flex-col bg-gradient-to-t from-amber-200/80 from-5% via-amber-200 to-amber-200/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-amber-400/60 mt-2 p-2 shadow">
            <UserIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Users
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">2</p>
        </div>
      </div>
    </div>
  );
}
