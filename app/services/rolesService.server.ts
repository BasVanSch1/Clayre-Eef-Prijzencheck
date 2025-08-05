import type { UserRole } from "~/components/Types";
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
