/**
 * WARNING: Before modifying this file, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/BuildInLabel.tsx"
 *
 * This file is provided by @keycloakify/keycloak-admin-ui version 260502.0.0.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

// @ts-nocheck

import { Label } from "../lib/ui";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

import style from "./build-in-label.module.css";

export const BuildInLabel = () => {
  const { t } = useTranslation();

  return (
    <Label icon={<CheckCircleIcon className={style.icon} />}>
      {t("buildIn")}
    </Label>
  );
};
