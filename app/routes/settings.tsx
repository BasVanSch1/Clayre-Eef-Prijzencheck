import { useState } from "react";
import type { Route } from "./+types/settings";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import DefaultProfileImage from "~/components/DefaultProfileImage";
import type { User } from "~/components/Types";
import { classNames } from "~/root";

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
  const { getUserSession, commitSession } = await import(
    "~/services/session.server"
  );
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

export async function action({ request }: Route.ActionArgs) {
  const { getUserSession } = await import("~/services/session.server");
  const session = await getUserSession(request);
  const userId = session.get("userId");
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "updateUserSettings") {
    const { updateUserSettings } = await import(
      "~/services/userService.server"
    );

    if (formData.get("newEmail") !== formData.get("confirmEmail")) {
      return {
        code: 400,
        message: "New email and confirmation do not match.",
      };
    }

    const result = await updateUserSettings(userId, formData);

    return { code: result.code, message: result.message };
  }

  if (actionType === "updateUserPassword") {
    // const { updateUserPassword } = await import("~/services/userService.server");
    // if (formData.get("newPassword") !== formData.get("confirmPassword")) {
    //   return {
    //     code: 400,
    //     message: "New password and confirmation do not match.",
    //   };
    // }
    // const result = await updateUserPassword(userId, formData);
    // return { code: result.code, message: result.message };
  }

  return { code: 400, message: "Invalid action." };
}

export default function Settings() {
  const data = useLoaderData();
  const user: User = data?.user;
  const [file, setFile] = useState<string | null>();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    setFile(URL.createObjectURL(uploadedFile));
  }

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
            <Form method="post" action="?updateUser">
              <div className="flex gap-5">
                {file && (
                  <img
                    src={file}
                    className="size-25 rounded-md border shadow-md"
                  ></img>
                )}

                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className={classNames(
                      file ? "hidden" : "",
                      "size-25 rounded-md border shadow-md"
                    )}
                  ></img>
                ) : (
                  <DefaultProfileImage />
                )}

                <div className="flex flex-col justify-center">
                  <label
                    htmlFor="profileImage"
                    className="mt-2 h-10 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
                  >
                    Change profile image
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    name="profileImage"
                    id="profileImage"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-gray-500 text-sm">
                    JPG, JPEG or PNG. 1MB max.
                  </p>
                </div>
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
                  className="p-2 mb-1 border border-gray-300 rounded-md w-[20vw] text-gray-700"
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
                disabled={
                  isSubmitting && navigation.formAction?.includes("updateUser")
                }
                className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
              >
                {isSubmitting && navigation.formAction?.includes("updateUser")
                  ? "Saving..."
                  : "Save changes"}
              </button>

              <input type="hidden" name="_action" value="updateUserSettings" />
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
            <Form method="post" action="?updatePassword">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Current password
              </label>
              <input
                type="password"
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
                    type="password"
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
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="p-2 border border-gray-300 rounded-md w-[20vw] bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting &&
                  navigation.formAction?.includes("updatePassword")
                }
                className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
              >
                {isSubmitting &&
                navigation.formAction?.includes("updatePassword")
                  ? "Saving..."
                  : "Change password"}
              </button>

              <input type="hidden" name="_action" value="updateUserPassword" />
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
