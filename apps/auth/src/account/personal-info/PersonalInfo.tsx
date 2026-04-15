/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/personal-info/PersonalInfo.tsx" --revert
 */

import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import type { TFunction } from "i18next";
import { useState } from "react";
import { type ErrorOption, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@albatroaz/ui/components/alert";
import { Button } from "@albatroaz/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@albatroaz/ui/components/collapsible";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { useEnvironment } from "../lib/shared";
import {
  beerify,
  debeerify,
  setUserProfileServerError,
} from "../lib/shared";
import {
  getPersonalInfo,
  getSupportedLocales,
  savePersonalInfo,
} from "../api/methods";
import type {
  UserProfileMetadata,
  UserRepresentation,
} from "../api/representations";
import { Page } from "../components/page/Page";
import { UserProfileFields } from "../components/UserProfileFields";
import type { Environment } from "../environment";
import { i18n, type TFuncKey } from "../i18n";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

export const PersonalInfo = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const [userProfileMetadata, setUserProfileMetadata] =
    useState<UserProfileMetadata>();
  const [supportedLocales, setSupportedLocales] = useState<string[]>([]);
  const form = useForm<UserRepresentation>({ mode: "onChange" });
  const { handleSubmit, reset, setValue, setError } = form;
  const { addAlert } = useAccountAlerts();

  usePromise(
    (signal) =>
      Promise.all([
        getPersonalInfo({ signal, context }),
        getSupportedLocales({ signal, context }),
      ]),
    ([personalInfo, locales]) => {
      setUserProfileMetadata(personalInfo.userProfileMetadata);
      setSupportedLocales(locales);
      reset(personalInfo);
      Object.entries(personalInfo.attributes || {}).forEach(([k, v]) =>
        setValue(`attributes[${beerify(k)}]`, v),
      );
    },
  );

  const onSubmit = async (user: UserRepresentation) => {
    try {
      const attributes = Object.fromEntries(
        Object.entries(user.attributes || {}).map(([k, v]) => [
          debeerify(k),
          v,
        ]),
      );
      await savePersonalInfo(context, { ...user, attributes });
      const locale = attributes["locale"]?.toString();
      if (locale) {
        await i18n.changeLanguage(locale, (error) => {
          if (error) console.warn("Error(s) loading locale", locale, error);
        });
      }
      await context.keycloak.updateToken();
      addAlert(t("accountUpdatedMessage"));
    } catch (error) {
      addAlert(t("accountUpdatedError"), "danger" as never);
      setUserProfileServerError(
        { responseData: { errors: error as never } },
        (name: string | number, e: unknown) =>
          setError(name as string, e as ErrorOption),
        ((key: TFuncKey, param?: object) =>
          t(key, param as never)) as TFunction,
      );
    }
  };

  if (!userProfileMetadata) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  const allFieldsReadOnly = () =>
    userProfileMetadata?.attributes
      ?.map((a) => a.readOnly)
      .reduce((p, c) => p && c, true);

  const {
    updateEmailFeatureEnabled,
    updateEmailActionEnabled,
    isRegistrationEmailAsUsername,
    isEditUserNameAllowed,
    deleteAccountAllowed,
  } = context.environment.features;

  return (
    <Page title={t("personalInfo")} description={t("personalInfoDescription")}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <UserProfileFields
          form={form}
          userProfileMetadata={userProfileMetadata}
          supportedLocales={supportedLocales}
          currentLocale={context.environment.locale}
          t={t as unknown as TFunction}
          renderer={(attribute) =>
            attribute.name === "email" &&
            updateEmailFeatureEnabled &&
            updateEmailActionEnabled &&
            attribute.annotations?.["kc.required.action.supported"] &&
            (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
              <Button
                id="update-email-btn"
                type="button"
                variant="link"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  context.keycloak.login({ action: "UPDATE_EMAIL" })
                }
              >
                {t("updateEmail")}
                <ArrowSquareOutIcon className="size-4" />
              </Button>
            ) : undefined
          }
        />

        {!allFieldsReadOnly() && (
          <div className="flex gap-2">
            <Button data-testid="save" type="submit" id="save-btn">
              {t("save")}
            </Button>
            <Button
              data-testid="cancel"
              id="cancel-btn"
              type="button"
              variant="ghost"
              onClick={() => reset()}
            >
              {t("cancel")}
            </Button>
          </div>
        )}

        {deleteAccountAllowed && (
          <Collapsible data-testid="delete-account">
            <CollapsibleTrigger className="text-sm text-foreground/70 underline-offset-4 hover:underline">
              {t("deleteAccount")}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <Alert variant="destructive">
                <AlertTitle>{t("deleteAccount")}</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>{t("deleteAccountWarning")}</p>
                  <Button
                    id="delete-account-btn"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      context.keycloak.login({ action: "delete_account" })
                    }
                  >
                    {t("delete")}
                  </Button>
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
        )}
      </form>
    </Page>
  );
};

export default PersonalInfo;
