import { createCookieSessionStorage, redirect } from "react-router";
import type { User } from "~/components/Types";

const USER_ID_KEY = "userId";
const USER_USERNAME_KEY = "userUsername";
const USER_NAME_KEY = "userName";
const USER_EMAIL_KEY = "userEmail";

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
      USER_ID_KEY
    )}, username: ${session.get(USER_USERNAME_KEY)}`
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(USER_ID_KEY);
  return userId;
}

export async function getUserFromSession(
  request: Request
): Promise<User | null> {
  const session = await getUserSession(request);
  const userId = session.get(USER_ID_KEY);
  if (!userId) return null;

  const user: User = {
    id: userId,
    username: session.get(USER_USERNAME_KEY),
    name: session.get(USER_NAME_KEY),
    email: session.get(USER_EMAIL_KEY),
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
  session.set(USER_ID_KEY, user.id);
  session.set(USER_USERNAME_KEY, user.username);
  session.set(USER_NAME_KEY, user.name);
  session.set(USER_EMAIL_KEY, user.email);
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
