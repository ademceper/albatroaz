/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/SigningIn.tsx" --revert
 */

import {
  InfoIcon,
  PlusIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Fragment, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@albatroaz/ui/components/button";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { useEnvironment } from "../lib/shared";
import { getCredentials } from "../api/methods";
import type {
  CredentialContainer,
  CredentialMetadataRepresentation,
} from "../api/representations";
import { EmptyRow } from "../components/datalist/EmptyRow";
import { Page } from "../components/page/Page";
import type { TFuncKey } from "../i18n";
import { formatDate } from "../utils/formatDate";
import { usePromise } from "../utils/usePromise";

export const SigningIn = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;

  const [credentials, setCredentials] = useState<CredentialContainer[]>();

  usePromise(
    (signal) => getCredentials({ signal, context }),
    setCredentials,
    [],
  );

  if (!credentials) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  const credentialUniqueCategories = [
    ...new Set(credentials.map((c) => c.category)),
  ];

  return (
    <Page title={t("signingIn")} description={t("signingInDescription")}>
      <div className="space-y-10">
        {credentialUniqueCategories.map((category) => (
          <section key={category} className="space-y-6">
            <h2
              id={`${category}-categ-title`}
              className="text-lg font-semibold text-foreground"
            >
              {t(category as TFuncKey)}
            </h2>
            {credentials
              .filter((cred) => cred.category === category)
              .map((container) => (
                <div key={container.type} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        data-testid={`${container.type}/title`}
                        className="text-sm font-medium text-foreground"
                      >
                        {t(container.displayName as TFuncKey)}
                      </h3>
                      <p
                        data-testid={`${container.type}/help-text`}
                        className="text-xs text-muted-foreground"
                      >
                        {t(container.helptext as TFuncKey)}
                      </p>
                    </div>
                    {container.createAction && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        data-testid={`${container.type}/create`}
                        onClick={() =>
                          login({ action: container.createAction })
                        }
                      >
                        <PlusIcon className="size-4" />
                        {t("setUpNew", {
                          name: t(
                            `${container.type}-display-name` as TFuncKey,
                          ),
                        })}
                      </Button>
                    )}
                  </div>

                  <div
                    data-testid={`${container.type}/credential-list`}
                    className="divide-y divide-border rounded-md border border-border"
                  >
                    {container.userCredentialMetadatas.length === 0 ? (
                      <div className="p-4">
                        <EmptyRow
                          message={t("notSetUp", {
                            name: t(container.displayName as TFuncKey),
                          })}
                        />
                      </div>
                    ) : (
                      container.userCredentialMetadatas.map((meta) => (
                        <CredentialRow
                          key={meta.credential.id}
                          meta={meta}
                          container={container}
                          onDelete={() =>
                            login({
                              action: `delete_credential:${meta.credential.id}`,
                            })
                          }
                          onUpdate={() =>
                            container.updateAction
                              ? login({ action: container.updateAction })
                              : undefined
                          }
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
          </section>
        ))}
      </div>
    </Page>
  );
};

type CredentialRowProps = {
  meta: CredentialMetadataRepresentation;
  container: CredentialContainer;
  onDelete: () => void;
  onUpdate: () => void;
};

function CredentialRow({
  meta,
  container,
  onDelete,
  onUpdate,
}: CredentialRowProps) {
  const { t } = useTranslation();
  const credential = meta.credential;
  const params = (m?: { key: string; parameters?: string[] }) =>
    m?.parameters?.reduce((acc, val, idx) => ({ ...acc, [idx]: val }), {}) ??
    {};

  return (
    <div
      id={`cred-${credential.id}`}
      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div
          data-testrole="label"
          className="truncate text-sm font-medium text-foreground"
        >
          {t(credential.userLabel) || t(credential.type as TFuncKey)}
        </div>
        {credential.createdDate && (
          <div data-testrole="created-at" className="text-xs text-muted-foreground">
            <Trans i18nKey="credentialCreatedAt">
              <strong className="me-1.5"></strong>
              {{ date: formatDate(new Date(credential.createdDate)) }}
            </Trans>
          </div>
        )}

        {meta.infoMessage && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <InfoIcon className="size-4" />
            {t(meta.infoMessage.key, params(meta.infoMessage))}
          </p>
        )}

        {meta.infoProperties && (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-[max-content_1fr]">
            {meta.infoProperties.map((prop) => (
              <Fragment key={prop.key}>
                <dt className="font-medium text-foreground/80">{t(prop.key)}</dt>
                <dd className="text-muted-foreground">
                  {prop.parameters ? prop.parameters[0] : ""}
                </dd>
              </Fragment>
            ))}
          </dl>
        )}

        {meta.warningMessageTitle && meta.warningMessageDescription && (
          <div className="flex gap-1.5 text-xs text-destructive">
            <WarningIcon className="size-4 shrink-0" />
            <div>
              <p className="font-medium">
                {t(
                  meta.warningMessageTitle.key,
                  params(meta.warningMessageTitle),
                )}
              </p>
              <p>
                {t(
                  meta.warningMessageDescription.key,
                  params(meta.warningMessageDescription),
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        id={`action-${credential.id}`}
        aria-label={t("updateCredAriaLabel")}
        aria-labelledby={`cred-${credential.id}`}
        className="flex shrink-0 gap-2"
      >
        {container.removeable && (
          <Button
            variant="destructive"
            size="sm"
            data-testrole="remove"
            onClick={onDelete}
          >
            {t("delete")}
          </Button>
        )}
        {container.updateAction && (
          <Button
            variant="outline"
            size="sm"
            data-testrole="update"
            onClick={onUpdate}
          >
            {t("update")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default SigningIn;
