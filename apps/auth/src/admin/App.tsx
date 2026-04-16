import { SessionExpirationWarningOverlay } from "./lib/SessionExpirationWarningOverlay";
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import { useEnvironment } from "./lib/shared";
import { type PropsWithChildren, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Separator } from "@albatroaz/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@albatroaz/ui/components/sidebar";
import {
  ErrorBoundaryFallback,
  ErrorBoundaryProvider,
  KeycloakSpinner,
} from "./lib/shared";
import { PageNav } from "./PageNav";
import { AdminClientContext, initAdminClient } from "./admin-client";
import { PageBreadCrumbs } from "./components/bread-crumb/PageBreadCrumbs";
import { ErrorRenderer } from "./components/error/ErrorRenderer";
import { RecentRealmsProvider } from "./context/RecentRealms";
import { AccessContextProvider } from "./context/access/Access";
import { RealmContextProvider } from "./context/realm-context/RealmContext";
import { ServerInfoProvider } from "./context/server-info/ServerInfoProvider";
import { WhoAmIContextProvider } from "./context/whoami/WhoAmI";
import type { Environment } from "./environment";
import { SubGroups } from "./groups/SubGroupsContext";
import { AuthWall } from "./root/AuthWall";
import { Banners } from "./Banners";

export const AppContexts = ({ children }: PropsWithChildren) => (
  <ErrorBoundaryProvider>
    <ErrorBoundaryFallback fallback={ErrorRenderer}>
      <ServerInfoProvider>
        <RealmContextProvider>
          <WhoAmIContextProvider>
            <RecentRealmsProvider>
              <AccessContextProvider>
                <SubGroups>{children}</SubGroups>
              </AccessContextProvider>
            </RecentRealmsProvider>
          </WhoAmIContextProvider>
        </RealmContextProvider>
      </ServerInfoProvider>
    </ErrorBoundaryFallback>
  </ErrorBoundaryProvider>
);

export const App = () => {
  const { keycloak, environment } = useEnvironment<Environment>();
  const [adminClient, setAdminClient] = useState<KeycloakAdminClient>();

  useEffect(() => {
    const fragment = "#/";
    if (window.location.href.endsWith(fragment)) {
      const newPath = window.location.pathname.replace(fragment, "");
      window.history.replaceState(null, "", newPath);
    }
    const init = async () => {
      const client = await initAdminClient(keycloak, environment);
      setAdminClient(client);
    };
    init().catch(console.error);
  }, [environment, keycloak]);

  if (!adminClient) return <KeycloakSpinner />;

  return (
    <AdminClientContext.Provider value={{ keycloak, adminClient }}>
      <AppContexts>
        <SidebarProvider>
          <PageNav />
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <PageBreadCrumbs />
              </div>
            </header>
            <Banners />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <ErrorBoundaryFallback fallback={ErrorRenderer}>
                <Suspense fallback={<KeycloakSpinner />}>
                  <AuthWall>
                    <Outlet />
                  </AuthWall>
                </Suspense>
              </ErrorBoundaryFallback>
            </div>
          </SidebarInset>
        </SidebarProvider>
        <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
      </AppContexts>
    </AdminClientContext.Provider>
  );
};
