import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/newUser";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useState, useEffect } from "react";
import validator from "validator";
import {
  DefaultProfileImage,
  IdCardIconInput,
  KeyIconInput,
  MailCheckIconInput,
  MailIconInput,
  UserIconInput,
} from "~/components/Icons";
import { classNames } from "~/root";
import { createUser } from "~/services/userService.server";
import { getRoles } from "~/services/rolesService.server";
import type { UserRole } from "~/components/Types";

export const handle = {
  title: "Maintenance > Users > New User",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Create new user" },
    { name: "description", content: "Prijzencheck Create New User" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const loggedInUser = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.users.create"
  );
  const roles = await getRoles();

  return { roles };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  if (action === "createUser") {
    const result = await createUser(formData);

    if (result.code === 201) {
      return redirect("/maintenance/users");
    }

    return {
      code: result.code,
      message: result.message,
      action: "updateUserSettings",
      fields: result.fields,
    };
  }

  return { code: 400, message: "Invalid action.", action: "createUser" };
}

export default function NewUser() {
  const existingRoles = useLoaderData().roles;
  const [file, setFile] = useState<File | null>();

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

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
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

  const handleValidatePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target.name;
    const password = event.target.value;

    if (password && password.trim().length > 0 && password.length < 4) {
      setFeedback((prev) =>
        prev.filter((msg) => !msg.fields?.includes(target))
      ); // Remove previous error for target

      setFeedback((prev) => [
        ...prev,
        {
          fields: [target],
          message: "Password must be at least 4 characters.",
        },
      ]);
    } else {
      setFeedback((prev) =>
        prev.filter((msg) => !msg.fields?.includes(target))
      ); // Remove error for target if password is valid
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
      <div className="flex flex-col">
        <Form method="post" action="?createUser" encType="multipart/form-data">
          <div className="flex gap-5">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Profile Avatar"
                className="size-25 rounded-md border shadow-md"
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
                  placeholder="Username"
                  className={classNames(
                    "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                    feedback.find((error) => error.fields?.includes("username"))
                      ? "focus:outline-0 border-red-500"
                      : ""
                  )}
                />
              </div>
              {feedback.find((error) => error.fields?.includes("username")) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) => error.fields?.includes("username"))
                      ?.message
                  }
                </p>
              )}
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
                  placeholder="Display name"
                  className="ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                />
              </div>
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
                  name="email"
                  placeholder="Email address"
                  onChange={handleValidateEmail}
                  className={classNames(
                    "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                    feedback.find((error) => error.fields?.includes("email"))
                      ? "focus:outline-0 border-red-500"
                      : ""
                  )}
                />
              </div>
              {feedback.find((error) => error.fields?.includes("email")) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) => error.fields?.includes("email"))
                      ?.message
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
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Password
              </label>
              <div className="relative">
                <KeyIconInput />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleValidatePassword}
                  className={classNames(
                    "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 transition-colors duration-200 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                    feedback.find((error) => error.fields?.includes("password"))
                      ? "focus:outline-0 border-red-500"
                      : ""
                  )}
                />
              </div>
              {feedback.find((error) => error.fields?.includes("password")) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) => error.fields?.includes("password"))
                      ?.message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Confirm Password
              </label>
              <div className="relative">
                <KeyIconInput />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  onChange={handleValidatePassword}
                  className={classNames(
                    "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 transition-colors duration-200 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                    feedback.find((error) =>
                      error.fields?.includes("confirmPassword")
                    )
                      ? "focus:outline-0 border-red-500"
                      : ""
                  )}
                />
              </div>
              {feedback.find((error) =>
                error.fields?.includes("confirmPassword")
              ) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) =>
                      error.fields?.includes("confirmPassword")
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
              <div className="flex flex-col md:flex-row flex-wrap gap-1">
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
              {feedback.find((error) => error.fields?.includes("roles")) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) => error.fields?.includes("roles"))
                      ?.message
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

          <div className="flex flex-col md:flex-row">
            <button
              type="submit"
              disabled={
                isSubmitting && navigation.formAction?.includes("createUser")
              }
              className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
            >
              {isSubmitting && navigation.formAction?.includes("createUser")
                ? "Creating..."
                : "Create user"}
            </button>

            {feedback?.find(
              (msg) => msg.action === "createUser" && !msg.fields
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

          <input type="hidden" name="_roles" value={roles.join(",")} />
          <input type="hidden" name="_action" value="createUser" />
        </Form>
      </div>
    </>
  );
}
