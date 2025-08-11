import { fileStorage } from "~/services/filestorage.server";
import type { Route } from "./+types/retrieveData";

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const product = url.searchParams?.get("product") === "true";
  let file;

  if (product) {
    const response = await fetch(
      `https://images.clayre-eef.com/lowres/${params.id}.jpg`
    );

    if (!response.ok) {
      throw new Response("Product file not found", { status: 404 });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("content-disposition") ||
      `attachment; filename=${params.id.split("/").pop()}`;
    file = {
      stream: () => response.body,
      type: contentType,
      name: params.id.split("/").pop() || "download",
      contentDisposition,
    };
  } else {
    file = await fileStorage.get(params.id);
  }

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
