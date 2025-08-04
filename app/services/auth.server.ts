import { redirect } from "react-router";
import { getUserFromSession } from "./session.server";
import { getPermissions } from "./userService.server";
import type { RolePermission } from "~/components/Types";

/**
 * Ensures the user is authenticated. If not, redirects to the login page.
 * Optionally accepts a redirect path after login.
 * @param {Request} request - The incoming request object.
 * @param {string} [redirectTo] - Optional path to redirect to after login.
 * @returns {Promise<any>} The authenticated user object, or redirects if not authenticated.
 */
export async function requireAuth(request: Request, redirectTo?: string) {
  const user = await getUserFromSession(request);

  if (!user) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", redirectTo || url.pathname);

    if (url.pathname !== "/login") {
      throw redirect(`/login?${searchParams}`);
    }
  }

  return user;
}

/**
 * Ensures the user has a specific permission. Redirects if not authorized.
 * @param {Request} request - The incoming request object.
 * @param {string} requiredPermission - The required permission name.
 * @param {string} [redirectTo] - Optional path to redirect to if unauthorized.
 * @returns {Promise<any>} The authenticated user object, or redirects if not authorized.
 */
export async function requirePermission(
  request: Request,
  requiredPermission: string,
  redirectTo?: string
) {
  const user = await requireAuth(request);

  if (!user) {
    throw redirect(redirectTo || "/login");
  }

  const permissions: RolePermission[] = await getPermissions(user.id);

  if (
    !permissions.some((permission) => permission.name === requiredPermission)
  ) {
    console.log(
      `User ${user.id} does not have required permission: ${requiredPermission}`
    );
    throw redirect(redirectTo || "/");
  }

  return user;
}

/**
 * Ensures the user has all specified permissions. Redirects if not authorized.
 * @param {Request} request - The incoming request object.
 * @param {string[]} requiredPermissions - Array of required permission names.
 * @param {string} [redirectTo] - Optional path to redirect to if unauthorized.
 * @returns {Promise<any>} The authenticated user object, or redirects if not authorized.
 */
export async function requirePermissions(
  request: Request,
  requiredPermissions: string[],
  redirectTo?: string
) {
  const user = await requireAuth(request);

  if (!user) {
    throw redirect(redirectTo || "/login");
  }

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
