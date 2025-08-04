import type { Route } from "./+types/maintenance";
import { requirePermission } from "~/services/auth.server";
import { ProductIcon, SearchIcon, UserIcon } from "~/components/Icons";
import { NavLink, useLoaderData } from "react-router";
import type { RolePermission, Statistics } from "~/components/Types";
import { getStatistics } from "~/services/statistics.server";
import { getPermissions } from "~/services/userService.server";

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

  user.permissions = await getPermissions(user.id); // refresh the user's permissions

  const navItems = [
    {
      name: "Statistics",
      href: "/maintenance/statistics",
      children: ["Statistics"],
    },
    {
      name: "Products",
      permission: "prijzencheck.pages.maintenance.products",
      href: "/maintenance/products",
      children: ["Products"],
    },
    {
      name: "Users",
      permission: "prijzencheck.pages.maintenance.users",
      href: "/maintenance/users",
      children: ["Users"],
    },
    {
      name: "Roles",
      permission: "prijzencheck.pages.maintenance.roles",
      href: "/maintenance/roles",
      children: ["Roles"],
    },
  ];

  const navigation = [
    ...navItems.filter((item) => {
      if (!item.permission) return true;

      return user?.permissions?.some(
        (perm: RolePermission) => perm.name === item.permission
      );
    }),
  ];

  const statistics = await getStatistics();

  return { statistics, navigation };
}

export default function Maintenance() {
  const statistics = useLoaderData().statistics as Statistics;
  const navigation = useLoaderData().navigation;

  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5 w-[80vw]">
      <div className="grid grid-cols-3 grid-rows[1fr_1fr_1fr_1fr] md:grid-cols-[15vw_1fr_1fr_1fr] md:grid-rows-[1fr_1fr_1fr] gap-x-2 gap-y-2 ">
        <div className="flex md:flex-col justify-evenly md:justify-start col-span-full col-start-1 row-start-1 md:col-end-1 md:row-span-full bg-gray-800 rounded-lg shadow-md">
          {navigation.map(
            (item: { name: string; href: string; children: any[] }) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="p-2 text-white hover:bg-gray-700 text-center rounded-lg"
              >
                {item.children}
              </NavLink>
            )
          )}
        </div>

        {/* Statistic Panels row 1*/}
        <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 grid-col-flex flex-col bg-gradient-to-t from-blue-300/80 from-5% via-blue-300 to-blue-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-blue-400/60 mt-2 p-2 shadow">
            <ProductIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Products
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.totalProducts}
          </p>
        </div>

        <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Lookups
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.totalLookups}
          </p>
        </div>

        <div className="col-start-3 row-start-2 md:col-start-4 md:row-start-1 flex flex-col bg-gradient-to-t from-amber-200/80 from-5% via-amber-200 to-amber-200/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-amber-400/60 mt-2 p-2 shadow">
            <UserIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Users
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.totalUsers}
          </p>
        </div>

        {/* Statistic Panels row 2*/}
        <div className="col-start-2 row-start-3 md:col-start-3 md:row-start-2 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              By EAN
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.lookupsByEAN}
          </p>
        </div>

        {/* Statistic Panels row 3*/}
        <div className="col-start-2 row-start-4 md:col-start-3 md:row-start-3 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              By code
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.lookupsByCode}
          </p>
        </div>
      </div>
    </div>
  );
}
