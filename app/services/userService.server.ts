import validator from "validator";
import { fileStorage } from "./filestorage.server";
import { endpoints } from "~/globals";
import type { RolePermission, User, UserRole } from "~/components/Types";

/**
 * Updates the user settings such as display name, email, and profile image.
 * Validates input, handles image upload, and sends a PATCH request to update user data.
 * @param userId - The ID of the user to update.
 * @param formData - The form data containing updated user settings.
 * @param admin - If true, allows updating username.
 * @returns An object with a status code, message, and optional fields with errors.
 */
export async function updateUserSettings(
  userId: string,
  formData: FormData,
  admin?: boolean
): Promise<{ code: number; message?: string; fields?: string[] }> {
  let displayName = formData.get("displayName") as string | null;
  let newEmail = formData.get("newEmail") as string | null;
  let username = formData.get("username") as string | null;
  const confirmEmail = formData.get("confirmEmail") as string;
  let newImage = formData.get("profileImage") as File | null;

  if (newImage && newImage instanceof File && newImage.size > 0) {
    if (newImage.size > 5 * 1024 * 1024) {
      return {
        code: 400,
        message: "Image size exceeds 5MB limit.",
        fields: ["profileImage"],
      };
    }
    if (!["image/jpeg", "image/png"].includes(newImage.type)) {
      return {
        code: 400,
        message: "Invalid image format. Only JPEG and PNG are allowed.",
        fields: ["profileImage"],
      };
    }

    await fileStorage.set(`${userId}-avatar`, newImage);
  }

  if (displayName && (displayName.length <= 0 || displayName.trim() === "")) {
    displayName = null;
  }

  if (newEmail && (newEmail.length <= 0 || newEmail.trim() === "")) {
    newEmail = null;
  }

  if (newEmail && newEmail !== confirmEmail) {
    return {
      code: 400,
      message: "New email and confirmation do not match.",
      fields: ["newEmail", "confirmEmail"],
    };
  }

  if (newEmail && !validator.isEmail(newEmail)) {
    return { code: 400, message: "Invalid email.", fields: ["newEmail"] };
  }

  if (admin && username && (username.length <= 0 || username.trim() === "")) {
    return {
      code: 400,
      message: "Username cannot be empty.",
      fields: ["username"],
    };
  }

  const formattedBody =
    "[" +
    (displayName
      ? `{"op": "replace", "path": "/displayName", "value": "${displayName}"},`
      : `{"op": "replace", "path": "/displayName", "value": null},`) +
    (newEmail
      ? `{"op": "replace", "path": "/email", "value": "${newEmail}"},`
      : "") +
    (admin && username
      ? `{"op": "replace", "path": "/userName", "value": "${username}"},`
      : "") +
    "]";

  try {
    const res = await fetch(
      `${endpoints.user.update}`.replace("{id}", userId),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: formattedBody,
      }
    );

    if (!res.ok) {
      console.error("Failed to update user settings:", await res.json());

      return { code: res.status, message: res.statusText };
    }

    return { code: 204, message: "Succesfully updated user settings." }; // No Content
  } catch (error) {
    console.error("Error updating user settings:", error);
    return { code: 500, message: `${error}` }; // Internal Server Error
  }
}

/**
 * Updates the user's password after verifying the current password.
 * Validates input, checks password requirements, and sends a PATCH request to update the password.
 * @param userId - The ID of the user whose password is being updated.
 * @param formData - The form data containing current, new, and confirmation passwords.
 * @param force - If true, skips current password verification (for admin use).
 * @returns An object with a status code, message, and optional fields with errors.
 */
export async function updateUserPassword(
  userId: string,
  formData: FormData,
  force?: boolean
): Promise<{ code: number; message?: string; fields?: string[] }> {
  const currentPassword = formData.get("currentPassword") as string | null;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate current password if force is not set (to true)
  if (!force) {
    if (!currentPassword || currentPassword.trim() === "") {
      return {
        code: 400,
        message: "Current password is required.",
        fields: ["currentPassword"],
      };
    }
  }

  if (newPassword !== confirmPassword) {
    console.log(
      `New password: ${newPassword}, Confirm new password: ${confirmPassword}`
    );
    return {
      code: 400,
      message: "New password and confirmation do not match.",
      fields: ["newPassword", "confirmNewPassword"],
    };
  }

  if (newPassword.length < 4) {
    return {
      code: 400,
      message: "New password must be at least 4 characters long.",
      fields: ["newPassword"],
    };
  }

  if (!force) {
    try {
      const res = await fetch(
        `${endpoints.authentication.verify}`.replace("{id}", userId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: currentPassword,
          }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          return {
            code: res.status,
            message: "Current password is incorrect.",
            fields: ["currentPassword"],
          };
        }

        return {
          code: res.status,
          message: res.statusText,
          fields: ["currentPassword"],
        };
      }
    } catch (error) {
      console.error("Error verifying current password:", error);
      return { code: 500, message: `${error}` }; // Internal Server Error
    }
  }

  const formattedBody =
    "[" +
    `{"op": "replace", "path": "/passwordHash", "value": "${newPassword}"},` +
    "]";

  try {
    const res = await fetch(
      `${endpoints.user.update}`.replace("{id}", userId),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: formattedBody,
      }
    );

    if (!res.ok) {
      console.error("Failed to update user password:", await res.json());

      return { code: res.status, message: res.statusText };
    }

    return { code: 204, message: "Succesfully updated password." }; // No Content
  } catch (error) {
    console.error("Error updating user password:", error);
    return { code: 500, message: `${error}` }; // Internal Server Error
  }
}

/**
 * Retrieves the permissions assigned to a user.
 * Fetches permissions from the backend and returns them as an array of RolePermission objects.
 * @param userId - The ID of the user whose permissions are being fetched.
 * @returns An array of RolePermission objects.
 */
export async function getPermissions(
  userId: string
): Promise<RolePermission[]> {
  try {
    const res = await fetch(
      `${endpoints.user.getPermissions.replace("{id}", userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch user permissions:", await res.json());
      return [];
    }

    const data = await res.json();

    const permissions: RolePermission[] =
      data.permissions.length > 0
        ? data.permissions.map((permission: RolePermission) => ({
            id: permission.id,
            name: permission.name,
            description: permission.description,
          }))
        : [];

    return permissions;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
}

/**
 * Retrieves a user by their ID.
 * Fetches user data from the backend and returns it as a User object.
 * @param userId - The ID of the user to fetch.
 * @returns The User object if found, otherwise null.
 */
export async function getUser(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`${endpoints.user.get}`.replace("{id}", userId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user:", await res.json());
      return null;
    }

    const data = await res.json();

    const roles = (
      data.roles.length > 0
        ? data.roles.map((role: UserRole) => ({
            id: role.id,
            name: role.name,
            description: role.description,
          }))
        : []
    ) as UserRole[];

    const permissions: RolePermission[] = await getPermissions(userId); // permissions are not included in the user data, so we fetch them separately

    const user: User = {
      id: data.userId,
      username: data.userName,
      name: data.displayName,
      email: data.email,
      roles: roles,
      permissions: permissions,
    };

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch(endpoints.user.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch users:", await res.json());
      return [];
    }

    const data = await res.json();

    const users: User[] = data
      ? data.map((user: any) => ({
          id: user.userId,
          username: user.userName,
          name: user.displayName,
          email: user.email,
          roles:
            (user.roles &&
              user.roles.map((role: UserRole) => {
                return {
                  id: role.id,
                  name: role.name,
                  description: role.description,
                };
              })) ||
            [],
        }))
      : [];

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
