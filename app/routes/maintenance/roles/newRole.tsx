import { requirePermission } from "~/services/auth.server";
import type { Route } from "./+types/newRole";
import { createRole, getAllPermissions } from "~/services/rolesService.server";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useEffect, useState } from "react";
import { classNames } from "~/root";
import { IdCardIconInput, TextIconInput } from "~/components/Icons";
import type { RolePermission } from "~/components/Types";

export const handle = {
  title: "Maintenance > Users > New Role",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - New role" },
    { name: "description", content: "Prijzencheck New Role" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(
    request,
    "prijzencheck.pages.maintenance.roles.create"
  );

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const permissions = await getAllPermissions();
  return { permissions };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  if (action === "createRole") {
    const result = await createRole(formData);

    if (result.code === 201) {
      return redirect("/maintenance/roles");
    }

    return {
      code: result.code,
      message: result.message,
      action: "createRole",
      fields: result.fields,
    };
  }

  return { code: 400, message: "Invalid action.", action: "createRole" };
}

export default function NewRole() {
  const existingPermissions = useLoaderData().permissions;
  const actionData = useActionData<{
    code: number;
    message?: string;
    action?: string;
    fields?: string[];
  }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [permissions, setPermissions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<
    {
      code?: number;
      message?: string;
      action?: string;
      fields?: string[];
    }[]
  >([]);

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
        <Form method="post" action="?createRole">
          <div className="flex md:gap-2 flex-col md:flex-row">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Name
              </label>
              <div className="relative">
                <IdCardIconInput />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className={classNames(
                    "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                    feedback.find((error) => error.fields?.includes("name"))
                      ? "focus:outline-0 border-red-500"
                      : ""
                  )}
                />
              </div>
              {feedback.find((error) => error.fields?.includes("name")) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) => error.fields?.includes("name"))
                      ?.message
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex md:gap-2 flex-col md:flex-row">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Description
              </label>
              <div className="relative">
                <TextIconInput />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  className={classNames(
                    "ps-10 p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500",
                    feedback.find((error) =>
                      error.fields?.includes("description")
                    )
                      ? "focus:outline-0 border-red-500"
                      : ""
                  )}
                />
              </div>
              {feedback.find((error) =>
                error.fields?.includes("description")
              ) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) =>
                      error.fields?.includes("description")
                    )?.message
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex md:gap-2 flex-col md:flex-row">
            <div className="md:w-[20vw]">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Permissions
              </label>
              <div className="flex flex-row flex-wrap gap-1">
                {permissions && permissions.length > 0 ? (
                  permissions.map((perm) => (
                    <p
                      key={perm}
                      className="border border-blue-400 rounded-md shadow-md bg-blue-300 text-sm p-1 dark:bg-purple-700 dark:border-purple-700 dark:text-neutral-300"
                    >
                      {perm}
                      <span
                        className="ml-1 cursor-pointer text-black rounded-full hover:text-red-500 transition-colors duration-200"
                        onClick={() =>
                          setPermissions((prevPermissions) =>
                            prevPermissions.filter((p) => p !== perm)
                          )
                        }
                      >
                        &times;
                      </span>
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm dark:text-neutral-300">
                    No permissions assigned
                  </p>
                )}
              </div>
              {feedback.find((error) =>
                error.fields?.includes("permissions")
              ) && (
                <p className="text-red-600 text-xs md:text-sm">
                  {
                    feedback.find((error) =>
                      error.fields?.includes("permissions")
                    )?.message
                  }
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-neutral-400">
                Add Permission
              </label>
              <select
                className="p-2 mb-1 border border-gray-300 rounded-md w-full md:w-[25vw] lg:w-[20vw] text-sm md:text-base bg-white dark:border-neutral-600 transition-colors duration-200 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
                name="addPermission"
                onChange={(e) => {
                  const selectedPermission = e.target.value;
                  if (
                    selectedPermission &&
                    !permissions.includes(selectedPermission)
                  ) {
                    setPermissions((prevPermissions) => [
                      ...prevPermissions,
                      selectedPermission,
                    ]);
                  }
                  e.target.selectedIndex = 0;
                }}
              >
                <option value="">Select a permission</option>
                {existingPermissions.filter(
                  (perm: RolePermission) => !permissions.includes(perm.name)
                ).length > 0 ? (
                  existingPermissions
                    .filter(
                      (perm: RolePermission) => !permissions.includes(perm.name)
                    )
                    .map((perm: RolePermission) => (
                      <option key={perm.id} value={perm.name}>
                        {perm.name}
                      </option>
                    ))
                ) : (
                  <option value="" disabled>
                    No permissions available
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <button
              type="submit"
              disabled={
                isSubmitting && navigation.formAction?.includes("createRole")
              }
              className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
            >
              {isSubmitting && navigation.formAction?.includes("createRole")
                ? "Creating..."
                : "Create role"}
            </button>

            {feedback?.find(
              (msg) => msg.action === "createRole" && !msg.fields
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

          <input
            type="hidden"
            name="_permissions"
            value={permissions.join(",")}
          />
          <input type="hidden" name="_action" value="createRole" />
        </Form>
      </div>
    </>
  );
}
