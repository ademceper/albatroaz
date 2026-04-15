/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/AccountRow.tsx" --revert
 */

import { LinkBreakIcon, LinkIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Badge } from "@albatroaz/ui/components/badge";
import { Button } from "@albatroaz/ui/components/button";
import { IconMapper, useEnvironment } from "../lib/shared";
import { unLinkAccount } from "../api/methods";
import type { LinkedAccountRepresentation } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";

type AccountRowProps = {
  account: LinkedAccountRepresentation;
  isLinked?: boolean;
  refresh: () => void;
};

export const AccountRow = ({
  account,
  isLinked = false,
  refresh,
}: AccountRowProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;
  const { addAlert, addError } = useAccountAlerts();

  const unLink = async () => {
    try {
      await unLinkAccount(context, account);
      addAlert(t("unLinkSuccess"));
      refresh();
    } catch (error) {
      addError("unLinkError", error);
    }
  };

  return (
    <div
      id={`${account.providerAlias}-idp`}
      data-testid={`linked-accounts/${account.providerName}`}
      className="grid grid-cols-1 items-center gap-3 p-4 sm:grid-cols-[1fr_auto_1fr_auto]"
    >
      <div className="flex items-center gap-2">
        <IconMapper icon={account.providerName} />
        <span id={`${account.providerAlias}-idp-name`} className="text-sm">
          {account.displayName}
        </span>
      </div>

      <div>
        <span id={`${account.providerAlias}-idp-label`}>
          <Badge variant={account.social ? "default" : "secondary"}>
            {t(account.social ? "socialLogin" : "systemDefined")}
          </Badge>
        </span>
      </div>

      <div
        id={`${account.providerAlias}-idp-username`}
        className="truncate text-sm text-muted-foreground"
      >
        {account.linkedUsername}
      </div>

      <div>
        {isLinked ? (
          <Button
            id={`${account.providerAlias}-idp-unlink`}
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={unLink}
          >
            <LinkBreakIcon className="size-4" />
            {t("unLink")}
          </Button>
        ) : (
          <Button
            id={`${account.providerAlias}-idp-link`}
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              login({ action: `idp_link:${account.providerAlias}` })
            }
          >
            <LinkIcon className="size-4" />
            {t("link")}
          </Button>
        )}
      </div>
    </div>
  );
};
