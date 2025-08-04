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
import type { UserRole } from "~/components/Types";

export const handle = {
  title: "Log in",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Log in" },
    { name: "description", content: "Prijzencheck Log in" },
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

    return createUserSession({
      request,
      remember: remember === "on",
      redirectUrl: redirectTo,
      user: {
        id: userData.userId,
        username: userData.userName,
        name: userData.displayName,
        email: userData.email,
        roles: (userData.roles.length > 0
          ? userData.roles.map((role: UserRole) => ({
              id: role.id,
              name: role.name,
              description: role.description,
            }))
          : []) as UserRole[],
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

      <div className="mt-5 sm:mx-aut sm:w-80 sm:max-w-sm">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="Block text-sm/6 font-medium text-gray-900 dark:text-neutral-200"
            >
              Gebruikersnaam
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
                Wachtwoord
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
              htmlFor="username"
              className="Block text-sm/6 font-medium text-gray-900 dark:text-neutral-400 ml-2"
            >
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
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
