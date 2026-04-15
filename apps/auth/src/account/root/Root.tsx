/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Root.tsx" --revert
 */

import { Suspense, useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";
import { Spinner } from "@albatroaz/ui/components/spinner";
import {
  ErrorPage,
  type KeycloakContext,
  useEnvironment,
} from "../lib/shared";
import fetchContentJson from "../content/fetchContent";
import { type Environment, environment } from "../environment";
import { routes } from "../routes";
import { usePromise } from "../utils/usePromise";
import { Header } from "./Header";
import { type MenuItem, PageNav } from "./PageNav";

function mapRoutes(
  context: KeycloakContext<Environment>,
  content: MenuItem[],
): RouteObject[] {
  return content
    .map((item) => {
      if ("children" in item) {
        return mapRoutes(context, item.children);
      }
      if (item.isVisible && !context.environment.features[item.isVisible]) {
        return null;
      }
      return {
        ...item,
        element:
          "path" in item
            ? routes.find((r) => r.path === (item.id ?? item.path))?.element
            : undefined,
      };
    })
    .filter((item) => !!item)
    .flat();
}

function Shell() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <PageNav />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto w-full max-w-4xl">
            <Suspense fallback={<Spinner className="size-6" />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export const Root = () => {
  const context = useEnvironment<Environment>();
  const [content, setContent] = useState<RouteObject[]>();

  usePromise(
    (signal) => fetchContentJson({ signal, context }),
    (content) => {
      setContent([
        {
          path: decodeURIComponent(new URL(environment.baseUrl).pathname),
          element: <Shell />,
          errorElement: <ErrorPage />,
          children: mapRoutes(context, content),
        },
      ]);
    },
  );

  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }
  return <RouterProvider router={createBrowserRouter(content)} />;
};
