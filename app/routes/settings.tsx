import { useEffect, useState } from "react";
import type { Route } from "./+types/settings";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { DefaultProfileImage, SearchIconInput } from "~/components/Icons";
import type { Statistics, User } from "~/components/Types";
import { classNames } from "~/root";
import validator from "validator";
import { keys } from "~/globals";
import { getUser } from "~/services/userService.server";
import { getStatistics } from "~/services/statistics.server";
import { getUserFromSession } from "~/services/session.server";

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
  const sessionUser = await getUserFromSession(request);

  if (!sessionUser) {
    return redirect("/");
  }

  const userId = sessionUser.id;
  const username = sessionUser.username;

  try {
    const user = await getUser(userId);

    if (!user) {
      console.log("redirecting to / ");
      return redirect("/");
    }

    const stats = await getStatistics(username);

    user.avatar = await fileStorage.get(`${user.id}-avatar`);
    user.avatarVersion = Date.now(); // Use current timestamp to force reload avatar

    session.set(keys.session.user.id, user.id);
    session.set(keys.session.user.username, user.username);
    session.set(keys.session.user.name, user.name);
    session.set(keys.session.user.email, user.email);
    session.set(keys.session.user.roles, user.roles);
    session.set(keys.session.user.permissions, user.permissions);

    return new Response(JSON.stringify({ user, stats }), {
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
  const userId = session.get(keys.session.user.id);
  const userDisplayName = session.get(keys.session.user.name);
  const userEmail = session.get(keys.session.user.email);
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
  const stats: Statistics = data?.stats;
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
    setFeedback([]); // Clear old feedback

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
        <div className="grid grid-cols-[20vw_auto] gap-x-2 grid-rows-[2fr_auto_1fr_auto_1fr] gap-y-2">
          <div className="col-start-1 row-start-1">
            <h1 className="mt-2 md:text-xl font-semibold text-black dark:text-neutral-300">
              User settings
            </h1>
            <p className="text-gray-700 dark:text-neutral-400 text-sm md:text-base">
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
                  <div className={classNames(file ? "hidden" : "")}>
                    <DefaultProfileImage />
                  </div>
                )}

                <div className="flex flex-col justify-center">
                  <label
                    htmlFor="profileImage"
                    className="mt-2 h-10 cursor-pointer rounded-md text-xs text-center p-1 md:p-2 md:text-base bg-[#007bff] hover:bg-[#0066ff] text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
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
                  <p className="text-gray-500 text-xs md:text-sm text-center dark:text-neutral-400">
                    JPG, JPEG or PNG. 5MB max.
                  </p>
                </div>
              </div>

              <div className={"flex md:gap-2 flex-col md:flex-row"}>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={user.username}
                    className="p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base text-gray-700 transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Display name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    defaultValue={user.name}
                    className="p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Email address
                </label>
                <input
                  type="text"
                  name="email"
                  defaultValue={user.email}
                  className="p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base text-gray-700 transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                  readOnly
                />
              </div>

              <div className="flex md:gap-2 flex-col md:flex-row">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    New email address
                  </label>
                  <input
                    type="text"
                    name="newEmail"
                    placeholder="New email address"
                    onChange={handleValidateEmail}
                    className={classNames(
                      "p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
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
                    <p className="text-red-600 text-xs md:text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("newEmail")
                        )?.message
                      }
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Confirm email address
                  </label>
                  <input
                    type="text"
                    name="confirmEmail"
                    placeholder="Confirm email address"
                    onChange={handleValidateEmail}
                    className={classNames(
                      "p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 transition-colors duration-200 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
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
                    <p className="text-red-600 text-xs md:text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("confirmEmail")
                        )?.message
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <button
                  type="submit"
                  disabled={
                    isSubmitting &&
                    navigation.formAction?.includes("updateUser")
                  }
                  className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
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
                      "ml-2 mt-2 text-xs md:text-sm self-center",
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
            <h1 className="md:text-xl font-semibold dark:text-neutral-300">
              Change password
            </h1>
            <p className="text-sm md:text-base text-gray-700 dark:text-neutral-400">
              Update your password associated with your account.
            </p>
          </div>
          <div className="col-start-2 row-start-3 flex flex-col">
            <Form method="post" action="?updatePassword">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Current password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                className={classNames(
                  "p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] bg-white text-sm md:text-base transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
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
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) =>
                      error.fields?.includes("currentPassword")
                    )?.message
                  }
                </p>
              )}

              <div className="flex flex-col md:gap-2 md:flex-row">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    className={classNames(
                      "p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] bg-white text-sm md:text-base transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
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
                    <p className="text-red-600 text-xs md:text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("newPassword")
                        )?.message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className={classNames(
                      "p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] bg-white text-sm md:text-base transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
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

              <div className="flex flex-col md:flex-row">
                <button
                  type="submit"
                  disabled={
                    isSubmitting &&
                    navigation.formAction?.includes("updatePassword")
                  }
                  className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
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
                      "ml-2 mt-2 text-xs md:text-sm self-center",
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
              <h1 className="md:text-xl font-semibold dark:text-neutral-300">
                Additional details
              </h1>
              <p className="text-sm md:text-base text-gray-700 dark:text-neutral-400">
                Additional (readonly) information about your account.
              </p>
            </div>
          </div>
          <div className="col-start-2 row-start-5 flex flex-col">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  User ID
                </label>
                <input
                  type="text"
                  name="userId"
                  defaultValue={user.id}
                  className="p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Roles
                </label>
                <div className="flex gap-2">
                  {user.roles?.length ? (
                    user.roles.map((role) => (
                      <p
                        key={role.id}
                        className="border border-blue-400 rounded-md shadow-md bg-blue-300 text-black text-sm p-1"
                      >
                        {role.name}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm dark:text-neutral-300">
                      No roles assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2">
              <div className="flex-grow">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Total Lookups
                </label>
                <div className="relative">
                  <SearchIconInput />
                  <input
                    type="text"
                    name="userId"
                    defaultValue={stats.totalLookups}
                    className="ps-10 p-2 border border-gray-300 rounded-md w-full text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex-grow">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Lookups by EAN
                </label>
                <div className="relative">
                  <SearchIconInput />
                  <input
                    type="text"
                    name="userId"
                    defaultValue={stats.lookupsByEAN}
                    className="ps-10 p-2 border border-gray-300 rounded-md w-full text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex-grow">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Lookups by code
                </label>
                <div className="relative">
                  <SearchIconInput />
                  <input
                    type="text"
                    name="userId"
                    defaultValue={stats.lookupsByCode}
                    className="ps-10 p-2 border border-gray-300 rounded-md w-full text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
