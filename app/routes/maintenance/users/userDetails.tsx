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
import type { Statistics, User, UserRole } from "~/components/Types";
import { useEffect, useState } from "react";
import validator from "validator";
import {
  ClockIconInput,
  DefaultProfileImage,
  HashIconInput,
  IdCardIconInput,
  KeyIconInput,
  MailCheckIconInput,
  MailIconInput,
  SearchIconInput,
  UserIconInput,
} from "~/components/Icons";
import { classNames } from "~/root";
import { fileStorage } from "~/services/filestorage.server";
import { getRoles } from "~/services/rolesService.server";
import { formatDate, keys } from "~/globals";
import { getUserSession } from "~/services/session.server";

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

  const roles = await getRoles();
  const lastLoginDate = formatDate(user.lastLoginDate);
  const lastLookupDate = formatDate(stats.lastLookupDate);

  return { user, stats, roles, lastLoginDate, lastLookupDate };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const session = await getUserSession(request);
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
      (image === null || image.size === 0) &&
      formData.get("_roles") === user.roles?.map((r) => r.name).join(",") &&
      formData.get("enabled") === (user.enabled ? "on" : null)
    ) {
      return {
        code: 400,
        message: "No changes detected.",
        action: "updateUserSettings",
      };
    }

    if (
      formData.get("enabled") === null &&
      userId === session.get(keys.session.user.id)
    ) {
      return {
        code: 400,
        message: "You cannot disable your own account.",
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
  const existingRoles: UserRole[] = loaderData.roles;
  const lastLoginDate: string = loaderData.lastLoginDate;
  const lastLookupDate: string = loaderData.lastLookupDate;
  const [file, setFile] = useState<string | null>();
  const [roles, setRoles] = useState<string[]>([]);

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

  const [enabledStatus, setEnabledStatus] = useState(
    user.enabled ? "enabled" : "disabled"
  );

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

  useEffect(() => {
    if (user.roles && user.roles.length > 0) {
      setRoles(user.roles.map((role) => role.name));
    }
  }, [user.roles]);

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
                  <div className="relative">
                    <UserIconInput />
                    <input
                      type="text"
                      name="username"
                      defaultValue={user.username}
                      className="ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Display name
                  </label>
                  <div className="relative">
                    <IdCardIconInput />
                    <input
                      type="text"
                      name="displayName"
                      defaultValue={user.name}
                      className="ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Email address
                </label>
                <div className="relative">
                  <MailIconInput />
                  <input
                    type="text"
                    name="email"
                    defaultValue={user.email}
                    className="ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base text-gray-700 transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex md:gap-2 flex-col md:flex-row">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    New email address
                  </label>
                  <div className="relative">
                    <MailIconInput />
                    <input
                      type="text"
                      name="newEmail"
                      placeholder="New email address"
                      onChange={handleValidateEmail}
                      className={classNames(
                        "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                        feedback.find((error) =>
                          error.fields?.includes("newEmail")
                        )
                          ? "focus:outline-0 border-red-500"
                          : ""
                      )}
                    />
                  </div>
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
                  <div className="relative">
                    <MailCheckIconInput />
                    <input
                      type="text"
                      name="confirmEmail"
                      placeholder="Confirm email address"
                      onChange={handleValidateEmail}
                      className={classNames(
                        "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 transition-colors duration-200 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                        feedback.find((error) =>
                          error.fields?.includes("confirmEmail")
                        )
                          ? "focus:outline-0 border-red-500"
                          : ""
                      )}
                    />
                  </div>
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

              <div className="flex md:gap-2 flex-col md:flex-row">
                <div className="w-[25vw] md:w-[20vw]">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Roles
                  </label>
                  <div className="flex flex-row flex-wrap gap-1">
                    {roles && roles.length > 0 ? (
                      roles.map((role) => (
                        <p
                          key={role}
                          className="border border-blue-400 rounded-md shadow-md bg-blue-300 text-sm p-1 dark:bg-purple-700 dark:border-purple-700 dark:text-neutral-300"
                        >
                          {role}
                          <span
                            className="ml-1 cursor-pointer text-black rounded-full hover:text-red-500 transition-colors duration-200"
                            onClick={() =>
                              setRoles((prevRoles) =>
                                prevRoles.filter((r) => r !== role)
                              )
                            }
                          >
                            &times;
                          </span>
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm dark:text-neutral-300">
                        No roles assigned
                      </p>
                    )}
                  </div>
                  {feedback.find((error) =>
                    error.fields?.includes("roles")
                  ) && (
                    <p className="text-red-600 text-xs md:text-sm">
                      {
                        feedback.find((error) =>
                          error.fields?.includes("roles")
                        )?.message
                      }
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                    Add role
                  </label>
                  <select
                    className="p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 transition-colors duration-200 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    name="addRole"
                    onChange={(e) => {
                      const selectedRole = e.target.value;
                      if (selectedRole && !roles.includes(selectedRole)) {
                        setRoles((prevRoles) => [...prevRoles, selectedRole]);
                      }
                      e.target.selectedIndex = 0;
                    }}
                  >
                    <option value="">Select a role</option>
                    {existingRoles.filter(
                      (role: UserRole) => !roles.includes(role.name)
                    ).length > 0 ? (
                      existingRoles
                        .filter((role: UserRole) => !roles.includes(role.name))
                        .map((role: UserRole) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))
                    ) : (
                      <option value="" disabled>
                        No roles available
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex md:gap-2 flex-col md:flex-row md:mt-2">
                <button
                  type="submit"
                  disabled={
                    isSubmitting &&
                    navigation.formAction?.includes("updateUser")
                  }
                  className="mt-auto mb-auto cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
                >
                  {isSubmitting && navigation.formAction?.includes("updateUser")
                    ? "Saving..."
                    : "Save changes"}
                </button>
                <label className="inline-flex items-center me-5 cursor-pointer mt-auto mb-auto">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    name="enabled"
                    defaultChecked={user.enabled}
                    onChange={(e) => {
                      setEnabledStatus(
                        e.target.checked ? "enabled" : "disabled"
                      );
                    }}
                  />
                  <div className="relative w-11 h-6 bg-neutral-200 rounded-full peer peer-focus:ring-0 dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                  <span
                    className={classNames(
                      enabledStatus === "enabled"
                        ? "text-green-600"
                        : "text-red-600",
                      "ms-2 text-sm font-medium"
                    )}
                  >
                    Account {enabledStatus}
                  </span>
                </label>
              </div>
              <div className="flex flex-col md:flex-row">
                {feedback?.find(
                  (msg) => msg.action === "updateUserSettings" && !msg.fields
                ) && (
                  <p
                    className={classNames(
                      "mt-2 text-xs md:text-sm self-center",
                      feedback?.find((msg) => msg.code === 204)
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {feedback?.find((msg) => !msg.fields)?.message}
                  </p>
                )}
              </div>

              <input type="hidden" name="_roles" value={roles.join(",")} />
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
                  <div className="relative">
                    <KeyIconInput />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New password"
                      className={classNames(
                        "ps-10 p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] bg-white text-sm md:text-base transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                        feedback.find((error) =>
                          error.fields?.includes("newPassword")
                        )
                          ? "focus:outline-0 border-red-500"
                          : ""
                      )}
                      required
                    />
                  </div>
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
                  <div className="relative">
                    <KeyIconInput />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      className={classNames(
                        "ps-10 p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] bg-white text-sm md:text-base transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                        feedback.find((error) =>
                          error.fields?.includes("confirmNewPassword")
                        )
                          ? "focus:outline-0 border-red-500"
                          : ""
                      )}
                      required
                    />
                  </div>
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
                <div className="relative">
                  <HashIconInput />
                  <input
                    type="text"
                    name="userId"
                    defaultValue={user.id}
                    className="ps-10 p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Roles
                </label>
                <div className="flex flex-row flex-wrap gap-2">
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
            <div className="flex flex-col md:flex-row md:gap-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Last login
                </label>
                <div className="relative">
                  <ClockIconInput />
                  <input
                    type="text"
                    name="lastLoginDate"
                    defaultValue={lastLoginDate}
                    className="ps-10 p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                  Last lookup
                </label>
                <div className="relative">
                  <ClockIconInput />
                  <input
                    type="text"
                    name="lastLoginDate"
                    defaultValue={lastLookupDate}
                    className="ps-10 p-2 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base transition-colors duration-200 text-gray-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
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
