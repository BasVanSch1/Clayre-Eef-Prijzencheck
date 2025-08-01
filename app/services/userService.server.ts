import validator from "validator";

const API_URL = process.env.API_URL;

export async function updateUserSettings(
  userId: string,
  formData: FormData
): Promise<{ code: number; message?: string; fields?: string[] }> {
  let displayName = formData.get("displayName") as string | null;
  let newEmail = formData.get("newEmail") as string | null;
  const confirmEmail = formData.get("confirmEmail") as string;
  const newImage = formData.get("profileImage") as File | null;

  // TODO: add saving new image logic

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
