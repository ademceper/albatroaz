/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/utils/useAccountAlerts.ts" --revert
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../lib/shared";
import { ApiError } from "../api/parse-response";

export function useAccountAlerts() {
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const addAccountError = useCallback(
    (messageKey: string, error: unknown) => {
      if (!(error instanceof ApiError)) {
        addError(messageKey, error);
        return;
      }
      const message = t(messageKey, { error: error.message });
      addAlert(message, "danger", error.description);
    },
    [addAlert, addError, t],
  );

  return useMemo(
    () => ({ addAlert, addError: addAccountError }),
    [addAccountError, addAlert],
  );
}
