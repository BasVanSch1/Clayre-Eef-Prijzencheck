import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/deleteUser";
import { deleteUser } from "~/services/userService.server";
import { NavLink, redirect, useLoaderData } from "react-router";

export const handle = {
  title: "Maintenance > Users > Delete User",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Delete user" },
    { name: "description", content: "Prijzencheck Delete User" },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const loggedInUser = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.users.delete"
  );

  if (!params.id) {
    return redirect("/maintenance/users");
  }

  if (params.id === loggedInUser.id) {
    return {
      code: 400,
      message: "You cannot delete your own user account.",
      userId: params.id,
    };
  }

  const result = await deleteUser(params.id);
  if (result.code === 204) {
    return redirect("/maintenance/users");
  }

  return { code: result.code, message: result.message, userId: params.id };
}

export async function action({ request }: Route.ActionArgs) {}

export default function DeleteUser() {
  const { code, message, userId } = useLoaderData() as {
    code: number;
    message: string;
    userId: string;
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-4 text-black dark:text-neutral-400">
          Delete User
        </h1>
        {!code ? (
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            You should have automatically been redirected to the users page, if
            that is not the case you can click {""}
            <NavLink
              key="usersRedirect"
              to="/maintenance/users"
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
                : "An error occurred while trying to delete the user."}
            </p>
            <p className="text-gray-600 dark:text-neutral-400">
              You can go back to the users page by clicking {""}
              <NavLink
                key="usersRedirect"
                to="/maintenance/users"
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
