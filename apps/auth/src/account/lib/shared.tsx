import type { Keycloak } from "oidc-spa/keycloak-js";
import { Keycloak as KeycloakClient } from "oidc-spa/keycloak-js";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@albatroaz/ui/components/button";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { Toaster } from "@albatroaz/ui/components/sonner";
import {
  AppleLogo,
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  GitlabLogo,
  GoogleLogo,
  InstagramLogo,
  LinkedInLogo,
  MicrosoftLogo,
  TwitterLogo,
} from "../../login/components/BrandLogos";

export type BaseEnvironment = {
  serverBaseUrl: string;
  realm: string;
  clientId: string;
  resourceUrl: string;
  logo: string;
  logoUrl: string;
  scope?: string;
};

export function getInjectedEnvironment<T>(): T {
  const element = document.getElementById("environment");
  const contents = element?.textContent;
  if (typeof contents !== "string") {
    throw new Error("Environment variables not found in the document.");
  }
  try {
    return JSON.parse(contents);
  } catch {
    throw new Error("Unable to parse environment variables as JSON.");
  }
}

export type KeycloakContext<T extends BaseEnvironment = BaseEnvironment> = {
  environment: T;
  keycloak: Keycloak;
};

const KeycloakEnvContext = createContext<KeycloakContext | undefined>(undefined);

export const useEnvironment = <
  T extends BaseEnvironment = BaseEnvironment,
>(): KeycloakContext<T> => {
  const context = useContext(KeycloakEnvContext);
  if (!context) {
    throw new Error("KeycloakProvider missing in the component tree");
  }
  return context as KeycloakContext<T>;
};

export const KeycloakProvider = <T extends BaseEnvironment>({
  environment,
  children,
}: PropsWithChildren<{ environment: T }>) => {
  const calledOnce = useRef(false);
  const [init, setInit] = useState(false);
  const [error, setError] = useState<unknown>();

  const keycloak = useMemo(
    () =>
      new KeycloakClient({
        url: environment.serverBaseUrl,
        realm: environment.realm,
        clientId: environment.clientId,
      }),
    [environment],
  );

  useEffect(() => {
    if (calledOnce.current) return;
    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        scope: environment.scope,
      })
      .then(() => setInit(true))
      .catch((e) => setError(e));
    calledOnce.current = true;
  }, [keycloak, environment.scope]);

  if (error) return <ErrorPage error={error} />;
  if (!init) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <KeycloakEnvContext.Provider
      value={{ environment, keycloak } as KeycloakContext}
    >
      {children}
      <Toaster position="top-right" richColors closeButton />
    </KeycloakEnvContext.Provider>
  );
};

export function ErrorPage({ error }: { error?: unknown }) {
  const { t, i18n } = useTranslation();
  const errorMessage = getErrorMessage(error);
  const networkErrorMessage = getNetworkErrorMessage(error);
  console.error(error);
  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md space-y-4 rounded-lg border border-border bg-card p-6 text-center shadow-md">
        <h1 className="text-lg font-semibold text-foreground">
          {t("somethingWentWrong")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {errorMessage
            ? t(errorMessage)
            : networkErrorMessage && i18n.exists(networkErrorMessage)
              ? t(networkErrorMessage)
              : t("somethingWentWrongDescription")}
        </p>
        <Button
          onClick={() => {
            location.href = location.origin + location.pathname;
          }}
        >
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}

export type AlertVariant = "success" | "danger" | "warning" | "info" | "default";

export type AddAlertFunction = (
  message: string,
  variant?: AlertVariant,
  description?: string,
) => void;
export type AddErrorFunction = (messageKey: string, error: unknown) => void;

export const useAlerts = () => {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      addAlert: ((message, variant = "success", description) => {
        const opts = description ? { description } : undefined;
        switch (variant) {
          case "danger":
            toast.error(message, opts);
            break;
          case "warning":
            toast.warning(message, opts);
            break;
          case "info":
            toast.info(message, opts);
            break;
          default:
            toast.success(message, opts);
        }
      }) as AddAlertFunction,
      addError: ((messageKey, error) => {
        const message = t(messageKey, { error: getErrorMessage(error) });
        const description = getErrorDescription(error);
        toast.error(message, description ? { description } : undefined);
      }) as AddErrorFunction,
    }),
    [t],
  );
};

export const label = (
  t: (key: string) => string,
  text: string | undefined,
  fallback?: string,
  prefix?: string,
) => {
  const value = text || fallback;
  const isBundle =
    typeof value === "string" ? value.includes("${") : false;
  const unwrapped = isBundle ? value!.substring(2, value!.length - 1) : value;
  const key = prefix ? `${prefix}.${unwrapped}` : unwrapped;
  return t(key || "");
};

const ERROR_FIELDS = ["error", "errorMessage"];
const ERROR_DESCRIPTION_FIELD = "error_description";

export function getErrorMessage(error: unknown): string | null {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return null;
}

export function getErrorDescription(error: unknown): string | undefined {
  if (
    error &&
    typeof error === "object" &&
    "responseData" in error &&
    error.responseData
  ) {
    return getNetworkErrorDescription(
      (error as { responseData: unknown }).responseData,
    );
  }
  return undefined;
}

export function getNetworkErrorDescription(data: unknown): string | undefined {
  if (
    typeof data === "object" &&
    data !== null &&
    ERROR_DESCRIPTION_FIELD in data &&
    typeof (data as Record<string, unknown>)[ERROR_DESCRIPTION_FIELD] ===
      "string"
  ) {
    return (data as Record<string, string>)[ERROR_DESCRIPTION_FIELD];
  }
}

export function getNetworkErrorMessage(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  for (const key of ERROR_FIELDS) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
  }
}

const PROVIDER_LOGO_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  github: GithubLogo,
  facebook: FacebookLogo,
  gitlab: GitlabLogo,
  google: GoogleLogo,
  linkedin: LinkedInLogo,
  "linkedin-openid-connect": LinkedInLogo,
  twitter: TwitterLogo,
  microsoft: MicrosoftLogo,
  instagram: InstagramLogo,
  apple: AppleLogo,
  discord: DiscordLogo,
};

export const IconMapper = ({ icon }: { icon: string }) => {
  const SpecificIcon = PROVIDER_LOGO_MAP[icon];
  if (SpecificIcon) {
    return <SpecificIcon aria-label={icon} className="size-5" />;
  }
  return (
    <span
      aria-label={icon}
      className="inline-flex size-5 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground uppercase"
    >
      {icon.slice(0, 2)}
    </span>
  );
};

export type KeyValueType = { key: string; value: string };

import type { FieldPath } from "react-hook-form";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import type { TFunction } from "i18next";

export type UserFormFields = Omit<
  UserRepresentation,
  "attributes" | "userProfileMetadata"
> & {
  attributes?: KeyValueType[] | Record<string, string | string[]>;
};

type FieldError = {
  field: string;
  errorMessage: string;
  params?: unknown[];
};
type ErrorArray = { errors?: FieldError[] };
export type UserProfileError = {
  responseData: ErrorArray | FieldError;
};

const ROOT_ATTRIBUTES = ["username", "firstName", "lastName", "email"];

export const isRootAttribute = (attr?: string) =>
  attr ? ROOT_ATTRIBUTES.includes(attr) : false;

export const fieldName = (name?: string) =>
  `${isRootAttribute(name) ? "" : "attributes."}${name?.replaceAll(
    ".",
    "🍺",
  )}` as FieldPath<UserFormFields>;

export const beerify = <T extends string>(name: T) =>
  name.replaceAll(".", "🍺");
export const debeerify = <T extends string>(name: T) =>
  name.replaceAll("🍺", ".");

const isBundleKey = (displayName: unknown) =>
  typeof displayName === "string" ? displayName.includes("${") : false;
const unWrap = (key: string) => key.substring(2, key.length - 1);

export function setUserProfileServerError<T>(
  error: UserProfileError,
  setError: (field: keyof T, params: object) => void,
  t: TFunction,
) {
  const errors =
    (error.responseData as ErrorArray).errors !== undefined
      ? (error.responseData as ErrorArray).errors!
      : [error.responseData as FieldError];
  errors.forEach((e) => {
    const params = Object.assign(
      {},
      e.params?.map((p) =>
        isBundleKey(p) ? t(unWrap(p as string)) : p,
      ),
    );
    setError(fieldName(e.field) as keyof T, {
      message: t(
        isBundleKey(e.errorMessage) ? unWrap(e.errorMessage) : e.errorMessage,
        {
          ...params,
          defaultValue: e.errorMessage || e.field,
        } as never,
      ),
      type: "server",
    });
  });
}

export function isUserProfileError(error: unknown): error is UserProfileError {
  if (
    typeof error !== "object" ||
    error === null ||
    !("responseData" in error)
  ) {
    return false;
  }
  return true;
}
