import type { Route } from "./+types/settings";
import { Form, redirect, useLoaderData } from "react-router";
import type { User } from "~/components/Types";
import { getUserFromSession } from "~/services/session.server";

export const handle = {
  title: "Settings",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Settings" },
    { name: "description", content: "Prijzencheck Settings" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user: User | null = await getUserFromSession(request);
  if (!user) {
    return redirect("/login");
  }

  return user;
}

export default function Settings() {
  const user: User = useLoaderData() as User;

  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <p className="text-4xl">This page is still under construction.</p>
      <h1 className="mt-2 md:my-5 text-2xl font-semibold text-center">
        User Settings
      </h1>

      <Form>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            name="id"
            defaultValue={user.id}
            className="w-full p-2 border border-gray-300 rounded-md"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            defaultValue={user.username}
            className="w-full p-2 border border-gray-300 rounded-md"
            readOnly
          />
        </div>
      </Form>
    </div>
  );
}
