import { lazy, Suspense, useMemo } from "react";
import { browserRuntimeFreeze } from "oidc-spa/browser-runtime-freeze";
import { DPoP } from "oidc-spa/DPoP";
import { oidcEarlyInit } from "oidc-spa/entrypoint";
import { type KcContext, setKcContext } from "./KcContext";

const { shouldLoadApp } = oidcEarlyInit({
  BASE_URL: location.pathname,
  sessionRestorationMethod: import.meta.env.DEV ? "full page redirect" : "auto",
  securityDefenses: {
    ...browserRuntimeFreeze({ excludes: ["fetch"] }),
    ...DPoP({ mode: "auto" }),
  },
});

const KcAdminUi = lazy(() => import("./KcAdminUi"));

let previousFingerprint: string | undefined;

function initEnvironment(kcContext: KcContext) {
  const fingerprint = JSON.stringify(kcContext);
  if (previousFingerprint !== undefined) {
    if (fingerprint !== previousFingerprint) window.location.reload();
    return;
  }
  previousFingerprint = fingerprint;

  setKcContext(kcContext);

  const environment = {
    serverBaseUrl: kcContext.serverBaseUrl ?? kcContext.authServerUrl,
    adminBaseUrl: kcContext.adminBaseUrl ?? kcContext.authServerUrl,
    authUrl: kcContext.authUrl,
    authServerUrl: kcContext.authServerUrl,
    realm: kcContext.loginRealm ?? "master",
    clientId: kcContext.clientId ?? "security-admin-console",
    resourceUrl: kcContext.resourceUrl,
    logo: "",
    logoUrl: "",
    consoleBaseUrl: kcContext.consoleBaseUrl,
    masterRealm: kcContext.masterRealm,
    resourceVersion: kcContext.resourceVersion,
  };

  const script = document.createElement("script");
  script.id = "environment";
  script.type = "application/json";
  script.textContent = JSON.stringify(environment, null, 1);
  document.body.appendChild(script);
}

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  useMemo(() => {
    initEnvironment(kcContext);
  }, [kcContext]);

  if (!shouldLoadApp) return null;

  return (
    <Suspense>
      <KcAdminUi />
    </Suspense>
  );
}
