import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/deleteUser";
import { getUser } from "~/services/userService.server";

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

  console.log("visited delete user page");

  const user = await getUser(params.id);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
}

export async function action({ request }: Route.ActionArgs) {}

export default function DeleteUser() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Delete User</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  );
}
