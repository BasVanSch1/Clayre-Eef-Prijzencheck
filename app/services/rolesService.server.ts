import type { RolePermission, UserRole } from "~/components/Types";
import { endpoints } from "~/globals";

export async function getRoles(): Promise<UserRole[]> {
  try {
    const res = await fetch(endpoints.role.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch roles:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();

    const roles =
      data && data.length > 0
        ? data.map((role: UserRole) => {
            return {
              id: role.id,
              name: role.name,
              description: role.description,
              permissions: role.permissions
                ? role.permissions.map((perm: any) => ({
                    id: perm.id,
                    name: perm.name,
                  }))
                : [],
            };
          })
        : [];

    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function getRole(searchParam: string): Promise<UserRole | null> {
  try {
    const res = await fetch(endpoints.role.get.replace("{id}", searchParam), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch role:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data as UserRole;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

export async function deleteRole(
  roleId: string
): Promise<{ code: number; message: string }> {
  try {
    const res = await fetch(
      `${endpoints.role.delete}`.replace("{id}", roleId),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return {
        code: res.status,
        message: errorData.message || "Failed to delete role",
      };
    }

    return { code: 204, message: "Role deleted successfully" };
  } catch (error) {
    console.error("Error deleting role:", error);
    return { code: 500, message: "Internal server error" };
  }
}

export async function createRole(
  formData: FormData
): Promise<{ code: number; message: string; fields?: string[] }> {
  const name = formData.get("name") as string | undefined;
  let description = formData.get("description") as string | undefined | null;
  const permissions = formData.get("_permissions") as string | undefined | null;
  let permissionsArray: RolePermission[] = [];

  if (!name || name.trim() === "") {
    return { code: 400, message: "Role name is required", fields: ["name"] };
  }

  if (!description || description.trim() === "") {
    description = null;
  }

  if (permissions && permissions.trim() !== "") {
    permissionsArray = permissions.split(",").map((perm) => {
      return {
        name: perm.trim(),
      };
    });
  }

  try {
    const res = await fetch(endpoints.role.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        description,
        permissions: permissionsArray,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      if (errorData.status === 409) {
        return {
          code: 409,
          message: "Role with this name already exists",
          fields: ["name"],
        };
      }

      return {
        code: res.status,
        message: errorData.message || "Failed to create role",
        fields: errorData.fields || [],
      };
    }

    return { code: 201, message: "Role created successfully" };
  } catch (error) {
    console.error("Error creating role:", error);
    return { code: 500, message: "Internal server error" };
  }
}

export async function updateRole(
  roleId: string,
  formData: FormData
): Promise<{ code: number; message: string; fields?: string[] }> {
  const name = formData.get("name") as string | undefined;
  let description = formData.get("description") as string | undefined | null;
  const permissions = formData.get("_permissions") as string | undefined | null;
  let permissionsArray: RolePermission[] = [];

  if (!name || name.trim() === "") {
    return { code: 400, message: "Role name is required", fields: ["name"] };
  }

  if (!description || description.trim() === "") {
    description = null;
  }

  if (permissions && permissions.trim() !== "") {
    permissionsArray = permissions.split(",").map((perm) => {
      return {
        name: perm.trim(),
      };
    });
  }

  const formattedBody =
    "[" +
    (name ? `{"op": "replace", "path": "/name", "value": "${name}"},` : "") +
    (description
      ? `{"op": "replace", "path": "/description", "value": "${description}"},`
      : `{"op": "replace", "path": "/description", "value": null},`) +
    (permissionsArray.length > 0
      ? `{"op": "replace", "path": "/permissions", "value": ${JSON.stringify(
          permissionsArray
        )}},`
      : "") +
    "]";

  try {
    const res = await fetch(endpoints.role.update.replace("{id}", roleId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: formattedBody,
    });

    if (!res.ok) {
      const errorData = await res.json();

      if (errorData.status === 409) {
        return {
          code: 409,
          message: "Role with this name already exists",
          fields: ["name"],
        };
      }

      console.log("Error data:", errorData);
      return {
        code: res.status,
        message: errorData.message || "Failed to update role",
        fields: errorData.fields || [],
      };
    }

    return { code: 200, message: "Role updated successfully" };
  } catch (error) {
    console.error("Error updating role:", error);
    return { code: 500, message: "Internal server error" };
  }
}

export async function getAllPermissions(): Promise<RolePermission[]> {
  try {
    const res = await fetch(endpoints.permission.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch permissions:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return data.map((perm: RolePermission) => ({
      id: perm.id,
      name: perm.name,
      description: perm.description,
    })) as RolePermission[];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return [];
  }
}
