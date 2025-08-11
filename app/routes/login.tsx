import { createUserSession, getUserId } from "~/services/session.server";
import type { Route } from "./+types/login";
import {
  Form,
  redirect,
  useActionData,
  useLocation,
  useNavigation,
} from "react-router";
import { classNames } from "~/root";
import { endpoints } from "~/globals";
import type { RolePermission, UserRole } from "~/components/Types";
import { getPermissions } from "~/services/userService.server";

export const handle = {
  title: "Login",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Login" },
    { name: "description", content: "Prijzencheck Login" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  // TODO: move authentication logic to a service

  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/";
  const remember = formData.get("remember");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return new Response("Invalid form data", { status: 400 });
  }

  try {
    const res = await fetch(`${endpoints.authentication.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: password }),
    });

    if (!res.ok) {
      return { errorCode: res.status, errorText: res.statusText };
    }

    const userData = await res.json();

    const roles = (
      userData.roles.length > 0
        ? userData.roles.map((role: UserRole) => ({
            id: role.id,
            name: role.name,
            description: role.description,
          }))
        : []
    ) as UserRole[];

    const permissions: RolePermission[] = await getPermissions(userData.userId); // permissions are not included in the user data, so we fetch them separately

    return createUserSession({
      request,
      remember: remember === "on",
      redirectUrl: redirectTo,
      user: {
        id: userData.userId,
        username: userData.username,
        name: userData.displayName,
        email: userData.email,
        roles: roles,
        permissions: permissions,
        lastLoginDate: new Date(userData.lastLoginDate),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const location = useLocation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <div className="text-center text-black dark:text-neutral-300">
        <h1 className="mt-2 md:my-5 text-4xl font-semibold">Login</h1>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-80 sm:max-w-sm">
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                className={classNames(
                  actionData?.errorCode === 404
                    ? "border-red-600"
                    : "border-gray-300 dark:border-neutral-600",
                  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-neutral-300 sm:text-sm/6 dark:bg-neutral-800 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-indigo-600"
                )}
                type="text"
                name="username"
                id="username"
                required
              />
            </div>
            {actionData?.errorCode === 404 ? (
              <p className="text-red-500 text-xs">Username not found</p>
            ) : null}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className={classNames(
                  actionData?.errorCode === 401
                    ? "border-red-600"
                    : "border-gray-300 dark:border-neutral-600",
                  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-neutral-300 sm:text-sm/6 dark:bg-neutral-800 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-indigo-600"
                )}
              />
            </div>
            {actionData?.errorCode === 401 ? (
              <p className="text-red-500 text-xs">
                Username or password incorrect
              </p>
            ) : null}
          </div>

          <div>
            <input type="checkbox" name="remember" id="remember" />
            <label
              htmlFor="remember"
              className="Block text-sm/6 font-medium text-gray-900 dark:text-neutral-400 ml-2"
            >
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>

          <input
            type="hidden"
            name="redirectTo"
            value={
              new URLSearchParams(location.search).get("redirectTo") || "/"
            }
          />
        </Form>
      </div>
    </div>
  );
}
