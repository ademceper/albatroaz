/**
 * WARNING: Before modifying this file, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/JavaScript.tsx"
 *
 * This file is provided by @keycloakify/keycloak-admin-ui version 260502.0.0.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

// @ts-nocheck

import { HelpItem } from "../../../lib/shared";
import { FormGroup } from "../../../lib/ui";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CodeEditor from "../../../components/form/CodeEditor";

export const JavaScript = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormGroup
      label={t("code")}
      labelIcon={
        <HelpItem helpText={t("policyCodeHelp")} fieldLabelId="code" />
      }
      fieldId="code"
      isRequired
    >
      <Controller
        name="code"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <CodeEditor
            id="code"
            data-testid="code"
            readOnly
            value={field.value}
            language="js"
            height={600}
          />
        )}
      />
    </FormGroup>
  );
};
