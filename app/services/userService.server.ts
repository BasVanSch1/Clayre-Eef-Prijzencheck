import validator from "validator";
import { fileStorage } from "./filestorage.server";
import { endpoints } from "~/globals";
import type { RolePermission } from "~/components/Types";

export async function updateUserSettings(
  userId: string,
  formData: FormData
): Promise<{ code: number; message?: string; fields?: string[] }> {
  let displayName = formData.get("displayName") as string | null;
  let newEmail = formData.get("newEmail") as string | null;
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

  const formattedBody =
    "[" +
    (displayName
      ? `{"op": "replace", "path": "/displayName", "value": "${displayName}"},`
      : `{"op": "replace", "path": "/displayName", "value": null},`) +
    (newEmail
      ? `{"op": "replace", "path": "/email", "value": "${newEmail}"},`
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

export async function updateUserPassword(
  userId: string,
  formData: FormData
): Promise<{ code: number; message?: string; fields?: string[] }> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || currentPassword.trim() === "") {
    return {
      code: 400,
      message: "Current password is required.",
      fields: ["currentPassword"],
    };
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
      console.error("Failed to update user settings:", await res.json());

      return { code: res.status, message: res.statusText };
    }

    return { code: 204, message: "Succesfully updated password." }; // No Content
  } catch (error) {
    console.error("Error updating user settings:", error);
    return { code: 500, message: `${error}` }; // Internal Server Error
  }
}

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
    const permissions: RolePermission[] = data.map((permission: any) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description || permission.name,
    }));

    return permissions || [];
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
}
