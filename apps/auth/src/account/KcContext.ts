import type { KcEnvName } from "../kc.gen";

export namespace KcContextLike {
  type Common = {
    realm: {
      name: string;
      registrationEmailAsUsername: boolean;
      editUsernameAllowed: boolean;
      isInternationalizationEnabled: boolean;
      identityFederationEnabled: boolean;
      userManagedAccessAllowed: boolean;
    };
    resourceUrl: string;
    baseUrl: {
      rawSchemeSpecificPart: string;
      scheme: string;
      authority: string;
      path: string;
    };
    locale: string;
    isAuthorizationEnabled: boolean;
    deleteAccountAllowed: boolean;
    updateEmailFeatureEnabled: boolean;
    updateEmailActionEnabled: boolean;
    isViewOrganizationsEnabled?: boolean;
    properties: Record<string, string | undefined>;
    darkMode?: boolean;
    referrerName?: string;
  };
  export type Keycloak25AndUp = Common & {
    serverBaseUrl: string;
    authUrl: string;
    clientId: string;
    authServerUrl: string;
    isOid4VciEnabled: boolean;
    isViewGroupsEnabled: boolean;
  };
}

export type KcContext = KcContextLike.Keycloak25AndUp & {
  themeType: "account";
  themeName: string;
  properties: Record<KcEnvName, string>;
};

let kcContext_global: KcContext | undefined;

export function setKcContext(kcContext: KcContext) {
  kcContext_global = kcContext;
}

export function getKcContext(): { kcContext: KcContext } {
  if (kcContext_global === undefined) {
    throw new Error(
      "getKcContext can only be called once KcAccountUi has been loaded",
    );
  }
  return { kcContext: kcContext_global };
}
