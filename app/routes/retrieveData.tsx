import { fileStorage } from "~/services/filestorage.server";
import type { Route } from "./+types/retrieveData";

export async function loader({ params }: Route.LoaderArgs) {
  const file = await fileStorage.get(params.id);

  if (!file) {
    throw new Response("File not found", {
      status: 404,
    });
  }

  return new Response(file.stream(), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename=${file.name}`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Expires: "0",
    },
  });
}
