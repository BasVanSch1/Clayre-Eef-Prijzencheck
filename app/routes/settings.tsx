import { useEffect, useState } from "react";
import type { Route } from "./+types/settings";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import DefaultProfileImage from "~/components/DefaultProfileImage";
import type { User } from "~/components/Types";
import { classNames } from "~/root";
import validator from "validator";
import { endpoints } from "~/globals";

const USER_ID_KEY = "userId";
const USER_USERNAME_KEY = "userUsername";
const USER_NAME_KEY = "userName";
const USER_EMAIL_KEY = "userEmail";

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
  const { fileStorage } = await import("~/services/filestorage.server");

  const session = await getUserSession(request);
  const userId = session.get(USER_ID_KEY);

  if (!userId) return redirect("/");

  try {
    const res = await fetch(`${endpoints.user.get}`.replace("{id}", userId));

    if (!res.ok) {
      console.error(
        "Failed to refresh user with id:",
        userId,
        res.status,
        res.statusText
      );

      return redirect("/");
    }

    const data = await res.json();
    const user: User = {
      id: data.userId,
      username: data.userName,
      name: data.displayName,
      email: data.email,
      avatar: await fileStorage.get(`${data.userId}-avatar`),
      avatarVersion: Date.now(), // Use current timestamp to force reload avatar
    };

    session.set(USER_ID_KEY, user.id);
    session.set(USER_USERNAME_KEY, user.username);
    session.set(USER_NAME_KEY, user.name);
    session.set(USER_EMAIL_KEY, user.email);

    return new Response(JSON.stringify({ user }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Failed to refresh user data:", error);
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const { getUserSession } = await import("~/services/session.server");
  const session = await getUserSession(request);
  const userId = session.get(USER_ID_KEY);
  const userDisplayName = session.get(USER_NAME_KEY);
  const userEmail = session.get(USER_EMAIL_KEY);
  const formData = await request.formData();
  const actionType = formData.get("_action");
  const image = formData.get("profileImage") as File | null;

  if (actionType === "updateUserSettings") {
    const { updateUserSettings } = await import(
      "~/services/userService.server"
    );

    if (
      userDisplayName === formData.get("displayName") &&
      (userEmail === formData.get("newEmail") ||
        formData.get("newEmail") === "") &&
      (image === null || image.size === 0)
    ) {
      return {
        code: 400,
        message: "No changes detected.",
        action: "updateUserSettings",
      };
    }

    const result = await updateUserSettings(userId, formData);

    return {
      code: result.code,
      message: result.message,
      action: "updateUserSettings",
      fields: result.fields,
    };
  }

  if (actionType === "updateUserPassword") {
    const { updateUserPassword } = await import(
      "~/services/userService.server"
    );

    const result = await updateUserPassword(userId, formData);

    return {
      code: result.code,
      message: result.message,
      action: "updateUserPassword",
      fields: result.fields,
    };
  }

  return { code: 400, message: "Invalid action.", action: actionType };
}

export default function Settings() {
  const data = useLoaderData();
  const user: User = data?.user;
  const [file, setFile] = useState<string | null>();

  const actionData = useActionData<{
    code: number;
    message?: string;
    action?: string;
    fields?: string[];
  }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [feedback, setFeedback] = useState<
    {
      code?: number;
      message?: string;
      action?: string;
      fields?: string[];
    }[]
  >([]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    setFile(URL.createObjectURL(uploadedFile));
  }

  const handleValidateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target.name;
    const email = event.target.value;

    if (email && email.length > 0 && !validator.isEmail(email)) {
      setFeedback((prev) =>
        prev.filter((msg) => !msg.fields?.includes(target))
      ); // Remove previous error for target

      setFeedback((prev) => [
        ...prev,
        { fields: [target], message: "Invalid email format." },
      ]);
    } else {
      setFeedback((prev) =>
        prev.filter((msg) => !msg.fields?.includes(target))
      ); // Remove error for target if email is valid
    }
  };

  useEffect(() => {
    if (actionData?.code) {
      setFeedback((prev) => prev.filter((msg) => !msg.fields));

      setFeedback((prev) => [
        ...prev,
        {
          code: actionData.code,
          message: actionData.message,
          action: actionData.action,
          fields: actionData.fields,
        },
      ]);
    }
  }, [actionData]);

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
            <Form
              method="post"
              action="?updateUser"
              encType="multipart/form-data"
            >
              <div className="flex gap-5">
                {file && (
                  <img
                    src={file}
                    className="size-25 rounded-md border shadow-md"
                  ></img>
                )}

                {user.avatar ? (
                  <img
                    src={`/data/${user.id}-avatar?v=${user.avatarVersion ?? 0}`}
                    alt="Profile"
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
                    JPG, JPEG or PNG. 5MB max.
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
                    onChange={handleValidateEmail}
                    className={classNames(
                      "p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white",
                      feedback.find((error) =>
                        error.fields?.includes("newEmail")
                      )
                        ? "focus:outline-0 border-red-500"
                        : ""
                    )}
                  />
                  {feedback.find((error) =>
                    error.fields?.includes("newEmail")
                  ) && (
                    <p className="text-red-600 text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("newEmail")
                        )?.message
                      }
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm email address
                  </label>
                  <input
                    type="text"
                    name="confirmEmail"
                    placeholder="Confirm new email address"
                    onChange={handleValidateEmail}
                    className={classNames(
                      "p-2 mb-1 border border-gray-300 rounded-md w-[20vw] bg-white",
                      feedback.find((error) =>
                        error.fields?.includes("confirmEmail")
                      )
                        ? "focus:outline-0 border-red-500"
                        : ""
                    )}
                  />
                  {feedback.find((error) =>
                    error.fields?.includes("confirmEmail")
                  ) && (
                    <p className="text-red-600 text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("confirmEmail")
                        )?.message
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex">
                <button
                  type="submit"
                  disabled={
                    isSubmitting &&
                    navigation.formAction?.includes("updateUser")
                  }
                  className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
                >
                  {isSubmitting && navigation.formAction?.includes("updateUser")
                    ? "Saving..."
                    : "Save changes"}
                </button>

                {feedback?.find(
                  (msg) => msg.action === "updateUserSettings" && !msg.fields
                ) && (
                  <p
                    className={classNames(
                      "ml-2 mt-2 text-sm self-center",
                      feedback?.find((msg) => msg.code === 204)
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {feedback?.find((msg) => !msg.fields)?.message}
                  </p>
                )}
              </div>

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
                className={classNames(
                  "p-2 border border-gray-300 rounded-md w-[20vw] bg-white",
                  feedback.find((error) =>
                    error.fields?.includes("currentPassword")
                  )
                    ? "focus:outline-0 border-red-500"
                    : ""
                )}
                required
              />
              {feedback.find((error) =>
                error.fields?.includes("currentPassword")
              ) && (
                <p className="text-red-600 text-sm">
                  {
                    feedback.find((error) =>
                      error.fields?.includes("currentPassword")
                    )?.message
                  }
                </p>
              )}

              <div className="flex gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    className={classNames(
                      "p-2 border border-gray-300 rounded-md w-[20vw] bg-white",
                      feedback.find((error) =>
                        error.fields?.includes("newPassword")
                      )
                        ? "focus:outline-0 border-red-500"
                        : ""
                    )}
                    required
                  />
                  {feedback.find((error) =>
                    error.fields?.includes("newPassword")
                  ) && (
                    <p className="text-red-600 text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("newPassword")
                        )?.message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className={classNames(
                      "p-2 border border-gray-300 rounded-md w-[20vw] bg-white",
                      feedback.find((error) =>
                        error.fields?.includes("confirmNewPassword")
                      )
                        ? "focus:outline-0 border-red-500"
                        : ""
                    )}
                    required
                  />
                  {feedback.find((error) =>
                    error.fields?.includes("confirmNewPassword")
                  ) && (
                    <p className="text-red-600 text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("confirmNewPassword")
                        )?.message
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex">
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

                {feedback?.find(
                  (msg) => msg.action === "updateUserPassword" && !msg.fields
                ) && (
                  <p
                    className={classNames(
                      "ml-2 mt-2 text-sm self-center",
                      feedback?.find((msg) => msg.code === 204)
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {feedback?.find((msg) => !msg.fields)?.message}
                  </p>
                )}
              </div>

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
