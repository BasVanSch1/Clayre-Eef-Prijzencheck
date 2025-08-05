import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/users";
import { getUsers } from "~/services/userService.server";
import { Await, useLoaderData } from "react-router";
import type { User } from "~/components/Types";
import UsersTable from "~/components/UsersTable";
import { Suspense } from "react";

export const handle = {
  title: "Maintenance > Users",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - User Maintenance" },
    { name: "description", content: "Prijzencheck User Maintenance" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.users"
  );
  const users = await getUsers();

  return { users };
}

export function HydrateFallback() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md">
        <div className="text-lg text-center font-mono">Loading users...</div>
      </div>
    </div>
  );
}

export default function Users() {
  const users = useLoaderData().users as User[];
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[auto_1fr_1fr]">
        <Suspense fallback={<HydrateFallback />}>
          <Await resolve={users}>
            {(users) => <UsersTable data={users} />}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
