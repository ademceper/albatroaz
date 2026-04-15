/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Header.tsx" --revert
 */

import { ArrowSquareOutIcon, UserIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@albatroaz/ui/components/avatar";
import { Button } from "@albatroaz/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@albatroaz/ui/components/dropdown-menu";
import { label, useEnvironment } from "../lib/shared";
import logoSvgUrl from "../assets/logo.svg";
import { environment } from "../environment";

function loggedInUserName(token: Record<string, unknown> | undefined, fallback: string) {
  if (!token) return fallback;
  const givenName = token.given_name as string | undefined;
  const familyName = token.family_name as string | undefined;
  const preferredUsername = token.preferred_username as string | undefined;
  if (givenName && familyName) return `${givenName} ${familyName}`;
  return givenName || familyName || preferredUsername || fallback;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ReferrerLink = () => {
  const { t } = useTranslation();
  if (!environment.referrerUrl) return null;
  return (
    <Button asChild variant="link" size="sm" className="gap-1.5">
      <a
        data-testid="referrer-link"
        href={environment.referrerUrl.replace("_hash_", "#")}
      >
        {t("backTo", {
          app: label(t, environment.referrerName, environment.referrerUrl),
        })}
        <ArrowSquareOutIcon className="size-4" />
      </a>
    </Button>
  );
};

export const Header = () => {
  const { environment, keycloak } = useEnvironment();
  const { t } = useTranslation();

  const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
  const internalLogoHref = useHref(logoUrl);
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

  const userName = loggedInUserName(keycloak.idTokenParsed, t("unknownUser"));
  const picture = keycloak.idTokenParsed?.picture as string | undefined;

  return (
    <header
      data-testid="page-header"
      className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4"
    >
      <a href={indexHref} className="flex items-center gap-2">
        <img src={logoSvgUrl} alt={t("logo")} className="h-7" />
      </a>

      <div className="flex items-center gap-2">
        <ReferrerLink />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              data-testid="options"
              className="gap-2"
            >
              <Avatar size="sm">
                {picture ? <AvatarImage src={picture} alt={t("avatar")} /> : null}
                <AvatarFallback>
                  {userName ? initials(userName) : <UserIcon className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem onSelect={() => keycloak.accountManagement()}>
              {t("manageAccount")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => keycloak.logout()}>
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
