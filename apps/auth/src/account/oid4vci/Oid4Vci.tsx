/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/oid4vci/Oid4Vci.tsx" --revert
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@albatroaz/ui/components/select";
import { useEnvironment } from "../lib/shared";
import { getIssuer, requestVCOffer } from "../api";
import type { CredentialsIssuer } from "../api/representations";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";

export const Oid4Vci = () => {
  const context = useEnvironment();
  const { t } = useTranslation();

  const initialSelected = t("verifiableCredentialsSelectionDefault");
  const [selected, setSelected] = useState<string>(initialSelected);
  const [qrCode, setQrCode] = useState<string>("");
  const [offerQRVisible, setOfferQRVisible] = useState<boolean>(false);
  const [credentialsIssuer, setCredentialsIssuer] = useState<CredentialsIssuer>();

  usePromise(() => getIssuer(context), setCredentialsIssuer);

  const selectOptions = useMemo(
    () => credentialsIssuer?.credential_configurations_supported ?? {},
    [credentialsIssuer],
  );
  const dropdownItems = useMemo(
    () => Object.keys(selectOptions),
    [selectOptions],
  );

  useEffect(() => {
    if (initialSelected !== selected && credentialsIssuer !== undefined) {
      requestVCOffer(context, selectOptions[selected], credentialsIssuer).then(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === "string") {
              setQrCode(result);
              setOfferQRVisible(true);
            }
          };
        },
      );
    }
  }, [selected, credentialsIssuer, context, initialSelected, selectOptions]);

  return (
    <Page
      title={t("verifiableCredentialsTitle")}
      description={t("verifiableCredentialsDescription")}
    >
      <div className="space-y-6">
        <Select
          value={selected === initialSelected ? undefined : selected}
          onValueChange={setSelected}
        >
          <SelectTrigger
            data-testid="credential-select"
            className="w-full max-w-md"
          >
            <SelectValue placeholder={initialSelected} />
          </SelectTrigger>
          <SelectContent>
            {dropdownItems.map((option) => (
              <SelectItem key={option} value={option} data-testid={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {offerQRVisible && (
          <img
            width={500}
            height={500}
            src={qrCode}
            data-testid="qr-code"
            alt="Verifiable credentials offer QR"
            className="rounded-md border border-border"
          />
        )}
      </div>
    </Page>
  );
};

export default Oid4Vci;
