import { redirect } from "react-router";
import { getUserFromSession } from "./session.server";
import { getPermissions } from "./userService.server";
import type { RolePermission } from "~/components/Types";

export async function requireAuth(request: Request, redirectTo?: string) {
  const user = await getUserFromSession(request);

  if (!user) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set("redirectTo", url.pathname + url.search);

    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

export async function requirePermission(
  request: Request,
  requiredPermission: string,
  redirectTo?: string
) {
  const user = await requireAuth(request);
  const permissions: RolePermission[] = await getPermissions(user.id);

  if (
    !permissions.some((permission) => permission.name === requiredPermission)
  ) {
    throw redirect(redirectTo || "/");
  }

  return user;
}

export async function requirePermissions(
  request: Request,
  requiredPermissions: string[],
  redirectTo?: string
) {
  const user = await requireAuth(request);
  const permissions: RolePermission[] = await getPermissions(user.id);

  if (
    !requiredPermissions.every((permission) =>
      permissions.some((p) => p.name === permission)
    )
  ) {
    throw redirect(redirectTo || "/");
  }

  return user;
}
