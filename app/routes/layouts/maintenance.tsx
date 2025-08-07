import type { RolePermission } from "~/components/Types";
import type { Route } from "./+types/maintenance";
import { getPermissions } from "~/services/userService.server";
import { requirePermission } from "~/services/auth.server";
import { NavLink, Outlet, useLoaderData } from "react-router";

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

  user.permissions = await getPermissions(user.id); // refresh the user's permissions

  const navItems = [
    {
      name: "Statistics",
      permission: "prijzencheck.pages.maintenance.statistics",
      href: "/maintenance",
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

  return { navigation };
}

export default function Maintenance() {
  const navigation = useLoaderData().navigation;

  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5 w-[80vw]">
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[15vw_1fr] md:grid-rows-1 gap-x-2 gap-y-2 ">
        <div className="flex md:flex-col justify-evenly md:justify-start col-start-1 row-start-1 bg-gray-800 rounded-lg shadow-md">
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
        <Outlet />
      </div>
    </div>
  );
}
