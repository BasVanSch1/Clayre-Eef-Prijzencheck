import { createCookieSessionStorage, redirect } from "react-router";
import type { User } from "~/components/Types";
import { keys } from "~/globals";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["very-secret-key-for-CE", "Another-key-for-CE-hihi"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

export const { commitSession, destroySession } = sessionStorage;

/**
 * Retrieves the user session from the request cookies.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Session>} The session object.
 */
export const getUserSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

/**
 * Logs out the current user by destroying their session and redirecting to the login page.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} Redirect response to the login page.
 */
export async function logout(request: Request) {
  const session = await getUserSession(request);
  console.log(
    `Destroying session for userId: ${session.get(
      keys.session.user.id
    )}, username: ${session.get(keys.session.user.username)}`
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

/**
 * Retrieves the user ID from the session, if available.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<string | undefined>} The user ID or undefined if not found.
 */
export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(keys.session.user.id);
  return userId;
}

/**
 * Retrieves the user object from the session, if available.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<User | null>} The user object or null if not found.
 */
export async function getUserFromSession(
  request: Request
): Promise<User | null> {
  const session = await getUserSession(request);
  const userId = session.get(keys.session.user.id);
  if (!userId) return null;

  const user: User = {
    id: userId,
    username: session.get(keys.session.user.username),
    name: session.get(keys.session.user.name),
    email: session.get(keys.session.user.email),
    roles: session.get(keys.session.user.roles),
  };

  return user;
}

/**
 * Creates a new user session and redirects to the specified URL or home page.
 * @param {Object} params - The parameters for session creation.
 * @param {Request} params.request - The incoming request object.
 * @param {boolean} params.remember - Whether to remember the session for 7 days or 1 hour.
 * @param {string} [params.redirectUrl] - Optional URL to redirect to after session creation.
 * @param {User} params.user - The user object to store in the session.
 * @returns {Promise<Response>} Redirect response to the specified URL or home page.
 */
export async function createUserSession({
  request,
  remember = false,
  redirectUrl,
  user,
}: {
  request: Request;
  remember: boolean;
  redirectUrl?: string;
  user: User;
}) {
  const session = await getUserSession(request);
  session.set(keys.session.user.id, user.id);
  session.set(keys.session.user.username, user.username);
  session.set(keys.session.user.name, user.name);
  session.set(keys.session.user.email, user.email);
  session.set(keys.session.user.roles, user.roles);

  console.log(
    `Created user session for userId: ${user.id}, username: ${
      user.username
    }, valid for: ${remember ? "7 days" : "1 hour"}`
  );

  return redirect(redirectUrl || "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 1, // 7 days or 1 hour
      }),
    },
  });
}
