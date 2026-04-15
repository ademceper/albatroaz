/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/SharedWith.tsx" --revert
 */

import { Trans } from "react-i18next";
import type { Permission } from "../api/representations";

type SharedWithProps = {
  permissions?: Permission[];
};

export const SharedWith = ({ permissions: p = [] }: SharedWithProps) => (
  <div
    data-testid={`shared-with-${p.length ? p.map((e) => e.username) : "none"}`}
    className="text-sm text-muted-foreground"
  >
    <Trans
      i18nKey="resourceSharedWith"
      count={p.length}
      values={{
        username: p[0]?.username,
        other: p.length - 1,
      }}
      components={{ s: <strong className="text-foreground" /> }}
    />
  </div>
);
