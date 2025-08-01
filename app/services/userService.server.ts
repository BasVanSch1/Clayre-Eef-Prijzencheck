import type { User } from "~/components/Types";

const API_URL = process.env.API_URL;

export async function updateUserSettings(
  userId: string,
  formData: FormData
): Promise<{ code: number; message?: string }> {
  const displayName = formData.get("displayName") as string;
  const newEmail = formData.get("newEmail") as string;
  const confirmEmail = formData.get("confirmEmail") as string;
  const newImage = formData.get("profileImage") as File | null;

  if (newEmail && newEmail !== confirmEmail) {
    return { code: 400, message: "New email and confirmation do not match." };
  }

  console.log("Updating user settings:", {
    displayName,
    newEmail,
    confirmEmail: formData.get("confirmEmail"),
    userId,
    newImage,
  });

  const formattedBody =
    "[" +
    (displayName
      ? `{"op": "replace", "path": "/displayName", "value": "${displayName}"},`
      : "") +
    (newEmail
      ? `{"op": "replace", "path": "/email", "value": "${newEmail}"},`
      : "") +
    (newImage
      ? `{"op": "replace", "path": "/profileImage", "value": "${newImage.name}"},`
      : "") +
    "]";

  try {
    const res = await fetch(`${API_URL}/Authentication/edit/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: formattedBody,
    });

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
