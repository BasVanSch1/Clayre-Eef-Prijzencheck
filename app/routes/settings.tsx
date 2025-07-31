import type { Route } from "./+types/settings";
import { Form, useLoaderData, useRevalidator } from "react-router";
import DefaultProfileImage from "~/components/DefaultProfileImage";
import type { User } from "~/components/Types";
import { commitSession, getUserSession } from "~/services/session.server";

const API_URL = process.env.API_URL;

export const handle = {
  title: "Settings",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Settings" },
    { name: "description", content: "Prijzencheck Settings" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getUserSession(request);
  const USER_ID_KEY = "userId";
  const USER_USERNAME_KEY = "userUsername";
  const USER_NAME_KEY = "userName";
  const USER_EMAIL_KEY = "userEmail";
  const USER_IMAGE_URL_KEY = "userImageUrl";

  const userId = session.get(USER_ID_KEY);

  if (!userId) return null;

  try {
    const res = await fetch(`${API_URL}/Authentication/lookup/${userId}`);

    if (!res.ok) {
      console.error(
        "Failed to refresh user with id:",
        userId,
        res.status,
        res.statusText
      );

      return null;
    }

    const data = await res.json();

    const user: User = {
      id: data.userId,
      username: data.userName,
      name: data.displayName,
      email: data.email,
      imageUrl: data.imageUrl || null,
    };

    session.set(USER_ID_KEY, user.id);
    session.set(USER_USERNAME_KEY, user.username);
    session.set(USER_NAME_KEY, user.name);
    session.set(USER_EMAIL_KEY, user.email);
    session.set(USER_IMAGE_URL_KEY, user.imageUrl);

    return new Response(JSON.stringify({ user }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Failed to refresh user data:", error);
    return null;
  }
}

export default function Settings() {
  const data = useLoaderData();
  const user: User = data?.user;

  return (
    <>
      <div className="col-start-3 row-start-3 flex flex-col mt-5 w-[80vw]">
        <div className="grid grid-cols-[20vw_auto] gap-x-1 grid-rows-[2fr_auto_1fr_auto_1fr] gap-y-2">
          <div className="col-start-1 row-start-1">
            <h1 className="mt-2 text-xl font-semibold ">User settings</h1>
            <p className="text-gray-700">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="col-start-2 row-start-1 flex flex-col">
            <Form>
              <div className="flex gap-2">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className="size-25 rounded-md border shadow-md"
                  ></img>
                ) : (
                  <DefaultProfileImage />
                )}
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={user.username}
                    className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] text-gray-700"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Display name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    defaultValue={user.name}
                    className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="text"
                  name="email"
                  defaultValue={user.email}
                  className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white"
                  readOnly
                />
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    New email address
                  </label>
                  <input
                    type="text"
                    name="newEmail"
                    placeholder="New email address"
                    className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm email address
                  </label>
                  <input
                    type="text"
                    name="confirmEmail"
                    placeholder="Confirm new email address"
                    className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
              >
                Save
              </button>
            </Form>
          </div>

          <hr className="col-span-full row-start-2 my-2 h-px border-0 bg-gray-400/40" />

          <div className="col-start-1 row-start-3">
            <h1 className="text-xl font-semibold ">Change password</h1>
            <p className="text-gray-700">
              Update your password associated with your account.
            </p>
          </div>
          <div className="col-start-2 row-start-3 flex flex-col">
            <Form>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Current password
              </label>
              <input
                type="text"
                name="currentPassword"
                placeholder="Current Password"
                className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white"
                required
              />

              <div className="flex gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="text"
                    name="newPassword"
                    placeholder="New password"
                    className="p-2 border border-gray-300 rounded-md w-[20vw] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <input
                    type="text"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="p-2 border border-gray-300 rounded-md w-[20vw] bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
              >
                Change password
              </button>
            </Form>
          </div>

          <hr className="col-span-full row-start-4 my-2 h-px border-0 bg-gray-400/40" />

          <div className="col-start-1 row-start-5">
            <div>
              <h1 className="text-xl font-semibold">Additional details</h1>
              <p className="text-gray-700">
                Additional (readonly) information about your account.
              </p>
            </div>
          </div>
          <div className="col-start-2 row-start-5 flex flex-col">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              defaultValue={user.id}
              className="p-2 border border-gray-300 rounded-md w-[20vw] text-gray-700"
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
}
