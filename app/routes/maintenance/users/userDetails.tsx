import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/userDetails";
import { getUser } from "~/services/userService.server";
import { getStatistics } from "~/services/statistics.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import type { Statistics, User } from "~/components/Types";
import { useEffect, useState } from "react";
import validator from "validator";
import { DefaultProfileImage, SearchIconInput } from "~/components/Icons";
import { classNames } from "~/root";
import { fileStorage } from "~/services/filestorage.server";

export const handle = {
  title: "Maintenance > Users > User Details",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - User Maintenance" },
    { name: "description", content: "Prijzencheck User Maintenance" },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const loggedInUser = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.users"
  );

  const user = await getUser(params.id);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const stats = await getStatistics(user.username);
  if (!stats) {
    throw new Response("Statistics not found", { status: 404 });
  }

  user.avatar = await fileStorage.get(`${user.id}-avatar`);
  user.avatarVersion = Date.now();

  return { user, stats };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("_action");
  const image = formData.get("profileImage") as File | null;
  const userId = new URL(request.url).pathname.split("/").pop();
  if (!userId) {
    return { code: 400, message: "User ID is required.", action: actionType };
  }

  const user = await getUser(userId);
  if (!user) {
    return { code: 404, message: "User not found.", action: actionType };
  }

  if (actionType === "updateUserSettings") {
    const { updateUserSettings } = await import(
      "~/services/userService.server"
    );

    if (
      user.username === formData.get("username") &&
      user.name === formData.get("displayName") &&
      (user.email === formData.get("newEmail") ||
        formData.get("newEmail") === "") &&
      (image === null || image.size === 0)
    ) {
      return {
        code: 400,
        message: "No changes detected.",
        action: "updateUserSettings",
      };
    }

    const result = await updateUserSettings(user.id, formData, true);

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

    const result = await updateUserPassword(user.id, formData, true);

    return {
      code: result.code,
      message: result.message,
      action: "updateUserPassword",
      fields: result.fields,
    };
  }

  return { code: 400, message: "Invalid action.", action: actionType };
}

export function HydrateFallback() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <div className="rounded-md border-1 border-gray-400/40 bg-white p-6 shadow-md">
        <div className="text-lg text-center font-mono">Loading user...</div>
      </div>
    </div>
  );
}

export default function UserDetails() {
  const loaderData = useLoaderData();
  const user: User = loaderData.user;
  const stats: Statistics = loaderData.stats;

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
      <div>
        <div className="grid grid-cols-1 gap-x-2 grid-rows-[auto_auto_auto_auto_auto] gap-y-2">
          <div className="flex flex-col">
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
                    className="p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
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

          <hr className="row-start-2 my-2 h-px border-0 bg-gray-400/40" />

          <div className="row-start-3 flex flex-col">
            <Form method="post" action="?updatePassword">
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

          <div className="row-start-5 flex flex-col">
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
