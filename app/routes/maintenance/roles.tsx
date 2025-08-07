import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/roles";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import RolesTable from "~/components/RolesTable";
import { getRoles } from "~/services/rolesService.server";
import type { UserRole } from "~/components/Types";

export const handle = {
  title: "Maintenance > Roles",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Role Maintenance" },
    { name: "description", content: "Prijzencheck Role Maintenance" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.roles"
  );

  const roles = await getRoles();

  return { roles };
}

export function HydrateFallback() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md">
        <div className="text-lg text-center font-mono">Loading roles...</div>
      </div>
    </div>
  );
}

export default function Roles() {
  const roles = useLoaderData().roles as UserRole[];
  return (
    <>
      <>
        <div className="grid grid-cols-1 grid-rows-[auto_auto_auto]">
          <Suspense fallback={<HydrateFallback />}>
            <Await resolve={roles}>
              {(roles) => <RolesTable data={roles} />}
            </Await>
          </Suspense>
        </div>
      </>
    </>
  );
}
