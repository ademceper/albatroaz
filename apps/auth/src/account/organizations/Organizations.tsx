/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/organizations/Organizations.tsx" --revert
 */

import type OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { useEnvironment } from "../lib/shared";
import { getUserOrganizations } from "../api/methods";
import { Page } from "../components/page/Page";
import type { Environment } from "../environment";
import { usePromise } from "../utils/usePromise";

export const Organizations = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();

  const [userOrgs, setUserOrgs] = useState<OrganizationRepresentation[]>();

  usePromise(
    (signal) => getUserOrganizations({ signal, context }),
    setUserOrgs,
  );

  if (!userOrgs) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <Page title={t("organizations")} description={t("organizationDescription")}>
      {userOrgs.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">
            {t("emptyUserOrganizations")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("emptyUserOrganizationsInstructions")}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[2fr_1fr_2fr] gap-4 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground">
            <div>{t("name")}</div>
            <div>{t("alias", { defaultValue: "Alias" })}</div>
            <div>{t("description")}</div>
          </div>
          {userOrgs.map((org) => (
            <div
              key={org.id}
              className="grid grid-cols-[2fr_1fr_2fr] gap-4 border-t border-border px-4 py-2 text-sm first:border-t-0"
            >
              <div className="font-medium text-foreground">{org.name}</div>
              <div className="text-muted-foreground">{org.alias}</div>
              <div className="text-muted-foreground">{org.description}</div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
};

export default Organizations;
