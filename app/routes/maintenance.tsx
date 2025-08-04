import type { Route } from "./+types/maintenance";
import { requirePermission } from "~/services/auth.server";
import { ProductIcon, SearchIcon, UserIcon } from "~/components/Icons";
import { NavLink } from "react-router";

export const handle = {
  title: "Maintenance > Statistics",
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
      <div className="grid grid-cols-3 grid-rows[1fr_1fr_1fr_1fr] md:grid-cols-[15vw_1fr_1fr_1fr] md:grid-rows-[1fr_1fr_1fr] gap-x-2 gap-y-2 ">
        <div className="flex md:flex-col justify-evenly md:justify-start col-span-full col-start-1 row-start-1 md:col-end-1 md:row-span-full bg-neutral-600 rounded-lg shadow-md">
          <NavLink
            to="/maintenance"
            className="p-2 text-white hover:bg-neutral-700 text-center rounded-t-lg"
          >
            Statistics
          </NavLink>
          <NavLink
            to="/maintenance/products"
            className="p-2 text-white hover:bg-neutral-700 text-center"
          >
            Products
          </NavLink>
          <NavLink
            to="/maintenance/users"
            className="p-2 text-white hover:bg-neutral-700 text-center"
          >
            Users
          </NavLink>
        </div>

        {/* Statistic Panels row 1*/}
        <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 grid-col-flex flex-col bg-gradient-to-t from-blue-300/80 from-5% via-blue-300 to-blue-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-blue-400/60 mt-2 p-2 shadow">
            <ProductIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Products
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">13,726</p>
        </div>

        <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Lookups
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">7,251</p>
        </div>

        <div className="col-start-3 row-start-2 md:col-start-4 md:row-start-1 flex flex-col bg-gradient-to-t from-amber-200/80 from-5% via-amber-200 to-amber-200/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-amber-400/60 mt-2 p-2 shadow">
            <UserIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Users
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">2</p>
        </div>

        {/* Statistic Panels row 2*/}
        <div className="col-start-2 row-start-3 md:col-start-3 md:row-start-2 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              By EAN
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">7,251</p>
        </div>

        {/* Statistic Panels row 3*/}
        <div className="col-start-2 row-start-4 md:col-start-3 md:row-start-3 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              By code
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">7,251</p>
        </div>
      </div>
    </div>
  );
}
