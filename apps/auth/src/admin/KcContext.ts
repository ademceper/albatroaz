import type { KcEnvName } from "../kc.gen";

export type KcContextLike = {
  serverBaseUrl?: string;
  adminBaseUrl?: string;
  authUrl: string;
  authServerUrl: string;
  loginRealm?: string;
  clientId?: string;
  resourceUrl: string;
  consoleBaseUrl: string;
  masterRealm: string;
  resourceVersion: string;
  properties: Record<string, string | undefined>;
  darkMode?: boolean;
};

export type KcContext = KcContextLike & {
  themeType: "admin";
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
      "getKcContext can only be called once KcAdminUi has been loaded",
    );
  }
  return { kcContext: kcContext_global };
}
