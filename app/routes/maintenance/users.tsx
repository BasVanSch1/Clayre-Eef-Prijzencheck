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

  const canAddUser = user.permissions?.some(
    (perm) => perm.name === "prijzencheck.pages.maintenance.users.create"
  );
  const canRemoveUser = user.permissions?.some(
    (perm) => perm.name === "prijzencheck.pages.maintenance.users.delete"
  );

  const users = await getUsers();

  return { users, canAddUser, canRemoveUser };
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
  const canAddUser = useLoaderData().canAddUser as boolean;
  const canRemoveUser = useLoaderData().canRemoveUser as boolean;

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[auto_auto_auto]">
        <Suspense fallback={<HydrateFallback />}>
          <Await resolve={users}>
            {(users) => (
              <UsersTable
                data={users}
                addUser={canAddUser}
                removeUser={canRemoveUser}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
