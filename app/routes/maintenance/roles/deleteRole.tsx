import { requirePermission } from "~/services/auth.server";
import { NavLink, redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/deleteRole";
import { deleteRole } from "~/services/rolesService.server";

export const handle = {
  title: "Maintenance > Users > Delete Role",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Delete role" },
    { name: "description", content: "Prijzencheck Delete Role" },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const loggedInUser = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.roles.delete"
  );

  if (!params.id) {
    return redirect("/maintenance/roles");
  }

  const result = await deleteRole(params.id);
  if (result.code === 204) {
    return redirect("/maintenance/roles");
  }

  return { code: result.code, message: result.message, roleId: params.id };
}

export default function DeleteUser() {
  const { code, message, roleId } = useLoaderData() as {
    code: number;
    message: string;
    roleId: string;
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-4 text-black dark:text-neutral-400">
          Delete User
        </h1>
        {!code ? (
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            You should have automatically been redirected to the roles page, if
            that is not the case you can click {""}
            <NavLink
              key="rolesRedirect"
              to="/maintenance/roles"
              className="underline text-blue-600 visited:text-purple-600 hover:text-blue-800"
            >
              here
            </NavLink>
            .
          </p>
        ) : (
          <>
            <p className="text-red-600 text-lg">
              {code && message
                ? `Error ${code} : ${message}`
                : "An error occurred while trying to delete the role."}
            </p>
            <p className="text-gray-600 dark:text-neutral-400">
              You can go back to the roles page by clicking {""}
              <NavLink
                key="rolesRedirect"
                to="/maintenance/roles"
                className="underline text-blue-600 hover:text-blue-800"
              >
                here
              </NavLink>
              .
            </p>
          </>
        )}
      </div>
    </>
  );
}
