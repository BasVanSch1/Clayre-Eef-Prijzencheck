import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRevalidator,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/root.css";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { getProductCount } from "./services/productService.server";
import { AuthProvider } from "./services/AuthProvider";
import { fileStorage } from "./services/filestorage.server";
import { requireAuth } from "./services/auth.server";

export function classNames(
  ...classes: (string | boolean | undefined | null)[]
) {
  return classes.filter(Boolean).join(" ");
}

export function HydrateFallback() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Loading...</h1>
      <p>Please wait while we load the content.</p>
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const productCount = await getProductCount();
  const user = await requireAuth(request);

  if (user) {
    user.avatar = await fileStorage.get(`${user.id}-avatar`);
    user.avatarVersion = Date.now(); // Use current timestamp to force reload avatar
  }

  return { productCount, user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { productCount: initialProductCount } =
    useLoaderData() as Route.ComponentProps["loaderData"] & {
      productCount: number;
    };
  const [productCount, setProductCount] = useState(initialProductCount);
  const { revalidate } = useRevalidator();

  // Initialize product count from loader data
  useEffect(() => {
    setProductCount(initialProductCount);
  }, [initialProductCount]);

  // Revalidate the productcount every 2 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Revalidating product count...");
      revalidate();
      console.log("Revalidation complete.");
    }, 2 * 60 * 1000); // 2 minutes in milliseconds (min * sec * ms)

    return () => clearInterval(intervalId);
  }, [revalidate]);

  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const pageTitle =
    (currentMatch?.data as { title?: string } | undefined)?.title ||
    (currentMatch?.handle as { title?: string } | undefined)?.title ||
    "Failed to retrieve page title";

  return (
    <html lang="en" className="h-full bg-gray-100 dark:bg-neutral-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-full">
          <NavBar />

          <header className="bg-white shadow-sm dark:bg-neutral-700">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-3 lg:px-5">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-neutral-300">
                {pageTitle}
              </h1>
            </div>
          </header>

          <main>
            <div className="relative grid grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr]">
              {children}
            </div>
          </main>
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <div className="col-start-1 w-screen row-start-3 flex flex-col mt-5">
        <div className="p-4 text-center bg-red-100 text-red-800 shadow-md">
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )}
        </div>
      </div>
    </>
  );
}
