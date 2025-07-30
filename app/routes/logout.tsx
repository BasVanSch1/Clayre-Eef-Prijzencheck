import { logout } from "~/services/session.server";
import type { Route } from "./+types/logout";

export const handle = {
  title: "Logged out",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Logged out" },
    { name: "description", content: "Logged out" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  return await logout(request);
}
