/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/LinkedAccounts.tsx" --revert
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../lib/shared";
import {
  getLinkedAccounts,
  type LinkedAccountQueryParams,
} from "../api/methods";
import type { LinkedAccountRepresentation } from "../api/representations";
import { EmptyRow } from "../components/datalist/EmptyRow";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";
import { AccountRow } from "./AccountRow";
import { LinkedAccountsToolbar } from "./LinkedAccountsToolbar";

export const LinkedAccounts = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const [linkedAccounts, setLinkedAccounts] = useState<
    LinkedAccountRepresentation[]
  >([]);
  const [unlinkedAccounts, setUnlinkedAccounts] = useState<
    LinkedAccountRepresentation[]
  >([]);

  const [paramsUnlinked, setParamsUnlinked] = useState<LinkedAccountQueryParams>({
    first: 0,
    max: 6,
    linked: false,
  });
  const [paramsLinked, setParamsLinked] = useState<LinkedAccountQueryParams>({
    first: 0,
    max: 6,
    linked: true,
  });
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    (signal) => getLinkedAccounts({ signal, context }, paramsUnlinked),
    setUnlinkedAccounts,
    [paramsUnlinked, key],
  );

  usePromise(
    (signal) => getLinkedAccounts({ signal, context }, paramsLinked),
    setLinkedAccounts,
    [paramsLinked, key],
  );

  return (
    <Page
      title={t("linkedAccounts")}
      description={t("linkedAccountsIntroMessage")}
    >
      <div className="space-y-10">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {t("linkedLoginProviders")}
          </h2>
          <LinkedAccountsToolbar
            onFilter={(search) =>
              setParamsLinked({ ...paramsLinked, first: 0, search })
            }
            count={linkedAccounts.length}
            first={paramsLinked.first}
            max={paramsLinked.max}
            onNextClick={() =>
              setParamsLinked({
                ...paramsLinked,
                first: paramsLinked.first + paramsLinked.max - 1,
              })
            }
            onPreviousClick={() =>
              setParamsLinked({
                ...paramsLinked,
                first: paramsLinked.first - paramsLinked.max + 1,
              })
            }
            onPerPageSelect={(first, max) =>
              setParamsLinked({ ...paramsLinked, first, max })
            }
            hasNext={linkedAccounts.length > paramsLinked.max - 1}
          />
          <div
            id="linked-idps"
            aria-label={t("linkedLoginProviders")}
            className="divide-y divide-border rounded-md border border-border"
          >
            {linkedAccounts.length > 0 ? (
              linkedAccounts.map(
                (account, index) =>
                  index !== paramsLinked.max - 1 && (
                    <AccountRow
                      key={account.providerName}
                      account={account}
                      isLinked
                      refresh={refresh}
                    />
                  ),
              )
            ) : (
              <div className="p-4">
                <EmptyRow message={t("linkedEmpty")} />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {t("unlinkedLoginProviders")}
          </h2>
          <LinkedAccountsToolbar
            onFilter={(search) =>
              setParamsUnlinked({ ...paramsUnlinked, first: 0, search })
            }
            count={unlinkedAccounts.length}
            first={paramsUnlinked.first}
            max={paramsUnlinked.max}
            onNextClick={() =>
              setParamsUnlinked({
                ...paramsUnlinked,
                first: paramsUnlinked.first + paramsUnlinked.max - 1,
              })
            }
            onPreviousClick={() =>
              setParamsUnlinked({
                ...paramsUnlinked,
                first: paramsUnlinked.first - paramsUnlinked.max + 1,
              })
            }
            onPerPageSelect={(first, max) =>
              setParamsUnlinked({ ...paramsUnlinked, first, max })
            }
            hasNext={unlinkedAccounts.length > paramsUnlinked.max - 1}
          />
          <div
            id="unlinked-idps"
            aria-label={t("unlinkedLoginProviders")}
            className="divide-y divide-border rounded-md border border-border"
          >
            {unlinkedAccounts.length > 0 ? (
              unlinkedAccounts.map(
                (account, index) =>
                  index !== paramsUnlinked.max - 1 && (
                    <AccountRow
                      key={account.providerName}
                      account={account}
                      refresh={refresh}
                    />
                  ),
              )
            ) : (
              <div className="p-4">
                <EmptyRow message={t("unlinkedEmpty")} />
              </div>
            )}
          </div>
        </section>
      </div>
    </Page>
  );
};

export default LinkedAccounts;
