import { lazy, Suspense, useMemo } from "react";
import { browserRuntimeFreeze } from "oidc-spa/browser-runtime-freeze";
import { DPoP } from "oidc-spa/DPoP";
import { oidcEarlyInit } from "oidc-spa/entrypoint";
import { type KcContext, setKcContext } from "./KcContext";

const KcAccountUi = lazy(() => import("./KcAccountUi"));

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  const { shouldLoadApp } = oidcEarlyInit({
    BASE_URL: kcContext.baseUrl.path,
    sessionRestorationMethod: import.meta.env.DEV
      ? "full page redirect"
      : "auto",
    securityDefenses: {
      ...browserRuntimeFreeze({ excludes: ["fetch"] }),
      ...DPoP({ mode: "auto" }),
    },
  });

  useMemo(() => {
    initEnvironment(kcContext);
  }, [kcContext]);

  if (!shouldLoadApp) return null;

  return (
    <Suspense>
      <KcAccountUi />
    </Suspense>
  );
}

let previousFingerprint: string | undefined;

function initEnvironment(kcContext: KcContext) {
  const fingerprint = JSON.stringify(kcContext);
  if (previousFingerprint !== undefined) {
    if (fingerprint !== previousFingerprint) {
      window.location.reload();
    }
    return;
  }
  previousFingerprint = fingerprint;

  setKcContext(kcContext);

  const referrerUrl = readQueryParamOrRestoreFromSessionStorage("referrer_uri");
  readQueryParamOrRestoreFromSessionStorage("referrer");

  const environment = {
    serverBaseUrl: kcContext.serverBaseUrl,
    authUrl: kcContext.authUrl,
    authServerUrl: kcContext.authServerUrl,
    realm: kcContext.realm.name,
    clientId: kcContext.clientId,
    resourceUrl: kcContext.resourceUrl,
    logo: "",
    logoUrl:
      referrerUrl === undefined ? "/" : referrerUrl.replace("_hash_", "#"),
    baseUrl: `${kcContext.baseUrl.scheme}:${kcContext.baseUrl.rawSchemeSpecificPart}`,
    locale: kcContext.locale,
    referrerName: persistOrRestore("referrerName", kcContext.referrerName),
    referrerUrl: referrerUrl ?? "",
    features: {
      isRegistrationEmailAsUsername:
        kcContext.realm.registrationEmailAsUsername,
      isEditUserNameAllowed: kcContext.realm.editUsernameAllowed,
      isInternationalizationEnabled:
        kcContext.realm.isInternationalizationEnabled,
      isLinkedAccountsEnabled: kcContext.realm.identityFederationEnabled,
      isMyResourcesEnabled:
        kcContext.realm.userManagedAccessAllowed &&
        kcContext.isAuthorizationEnabled,
      deleteAccountAllowed: kcContext.deleteAccountAllowed,
      updateEmailFeatureEnabled: kcContext.updateEmailFeatureEnabled,
      updateEmailActionEnabled: kcContext.updateEmailActionEnabled,
      isViewGroupsEnabled: kcContext.isViewGroupsEnabled ?? false,
      isOid4VciEnabled: kcContext.isOid4VciEnabled ?? false,
      isViewOrganizationsEnabled: kcContext.isViewOrganizationsEnabled ?? false,
    },
  };

  const script = document.createElement("script");
  script.id = "environment";
  script.type = "application/json";
  script.textContent = JSON.stringify(environment, null, 1);
  document.body.appendChild(script);
}

function readQueryParamOrRestoreFromSessionStorage(
  name: string,
): string | undefined {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(name);
  const PREFIX = "keycloakify:";
  if (value !== null) {
    sessionStorage.setItem(`${PREFIX}${name}`, value);
    url.searchParams.delete(name);
    window.history.replaceState({}, "", url.toString());
    return value;
  }
  return sessionStorage.getItem(`${PREFIX}${name}`) ?? undefined;
}

function persistOrRestore(key: string, value: string | undefined) {
  if (value !== undefined) {
    sessionStorage.setItem(key, value);
    return value;
  }
  return sessionStorage.getItem(key) ?? undefined;
}
