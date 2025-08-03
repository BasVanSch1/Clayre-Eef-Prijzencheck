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

export const getUserSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

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

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(keys.session.user.id);
  return userId;
}

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
