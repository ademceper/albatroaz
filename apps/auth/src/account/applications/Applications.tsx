/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/applications/Applications.tsx" --revert
 */

import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  CheckIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@albatroaz/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@albatroaz/ui/components/collapsible";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { label, useEnvironment } from "../lib/shared";
import { deleteConsent, getApplications } from "../api/methods";
import type { ClientRepresentation } from "../api/representations";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Page } from "../components/page/Page";
import type { TFuncKey } from "../i18n";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

type Application = ClientRepresentation & { open: boolean };

export const Applications = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [applications, setApplications] = useState<Application[]>();
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    (signal) => getApplications({ signal, context }),
    (clients) => setApplications(clients.map((c) => ({ ...c, open: false }))),
    [key],
  );

  const removeConsent = async (id: string) => {
    try {
      await deleteConsent(context, id);
      refresh();
      addAlert(t("removeConsentSuccess"));
    } catch (error) {
      addError("removeConsentError", error);
    }
  };

  if (!applications) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <Page title={t("application")} description={t("applicationsIntroMessage")}>
      <div
        id="applications-list"
        aria-label={t("application")}
        className="overflow-hidden rounded-md border border-border"
      >
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground sm:grid-cols-[2fr_2fr_2fr_auto]">
          <div>{t("name")}</div>
          <div className="hidden sm:block">{t("applicationType")}</div>
          <div className="hidden sm:block">{t("status")}</div>
          <div />
        </div>

        {applications.map((application) => (
          <Collapsible
            key={application.clientId}
            data-testid="applications-list-item"
            className="border-t border-border first:border-t-0"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 text-sm sm:grid-cols-[2fr_2fr_2fr_auto]">
              <div>
                {application.effectiveUrl ? (
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto gap-1.5 px-0"
                  >
                    <a
                      href={application.effectiveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {label(
                        t,
                        application.clientName || application.clientId,
                      )}
                      <ArrowSquareOutIcon className="size-4" />
                    </a>
                  </Button>
                ) : (
                  label(t, application.clientName || application.clientId)
                )}
              </div>
              <div className="hidden text-muted-foreground sm:block">
                {application.userConsentRequired
                  ? t("thirdPartyApp")
                  : t("internalApp")}
                {application.offlineAccess ? `, ${t("offlineAccess")}` : ""}
              </div>
              <div className="hidden text-muted-foreground sm:block">
                {application.inUse ? t("inUse") : t("notInUse")}
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  id={`toggle-${application.clientId}`}
                  aria-controls={`content-${application.clientId}`}
                  className="group"
                >
                  <CaretDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent
              id={`content-${application.clientId}`}
              aria-label={t("applicationDetails", {
                clientId: application.clientId,
              })}
              className="bg-muted/20 px-4 pb-4"
            >
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 pt-3 text-xs sm:grid-cols-[max-content_1fr]">
                <Row term={t("client")} value={application.clientId} />
                {application.description && (
                  <Row term={t("description")} value={application.description} />
                )}
                {application.effectiveUrl && (
                  <Row term="URL" value={application.effectiveUrl} />
                )}
                {application.consent && (
                  <>
                    <dt className="font-medium text-foreground/80">
                      {t("hasAccessTo")}
                    </dt>
                    <dd>
                      {application.consent.grantedScopes.map((scope) => (
                        <p
                          key={scope.id}
                          className="flex items-center gap-1.5 text-muted-foreground"
                        >
                          <CheckIcon className="size-3.5" />
                          {t(scope.name as TFuncKey, scope.displayText)}
                        </p>
                      ))}
                    </dd>
                    {application.tosUri && (
                      <Row
                        term={t("termsOfService")}
                        value={application.tosUri}
                      />
                    )}
                    {application.policyUri && (
                      <Row
                        term={t("privacyPolicy")}
                        value={application.policyUri}
                      />
                    )}
                    {application.logoUri && (
                      <>
                        <dt className="font-medium text-foreground/80">
                          {t("logo")}
                        </dt>
                        <dd>
                          <img
                            src={application.logoUri}
                            alt=""
                            className="h-8"
                          />
                        </dd>
                      </>
                    )}
                    <Row
                      term={t("accessGrantedOn")}
                      value={formatDate(
                        new Date(application.consent.createdDate),
                      )}
                    />
                  </>
                )}
              </dl>

              {(application.consent || application.offlineAccess) && (
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
                  <ConfirmDialog
                    buttonTitle={t("removeAccess")}
                    modalTitle={t("removeAccess")}
                    description={t("removeModalMessage", {
                      name: application.clientId,
                    })}
                    continueLabel={t("confirm")}
                    cancelLabel={t("cancel")}
                    onContinue={() => removeConsent(application.clientId)}
                  />
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <InfoIcon className="size-4" />
                    {t("infoMessage")}
                  </span>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Page>
  );
};

function Row({ term, value }: { term: string; value: string }) {
  return (
    <>
      <dt className="font-medium text-foreground/80">{term}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </>
  );
}

export default Applications;
