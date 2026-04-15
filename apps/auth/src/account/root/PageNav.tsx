/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/PageNav.tsx" --revert
 */

import { CaretDownIcon } from "@phosphor-icons/react";
import {
  type MouseEvent as ReactMouseEvent,
  type PropsWithChildren,
  Suspense,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  matchPath,
  useHref,
  useLinkClickHandler,
  useLocation,
} from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@albatroaz/ui/components/collapsible";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { cn } from "@albatroaz/ui/lib/utils";
import { useEnvironment } from "../lib/shared";
import fetchContentJson from "../content/fetchContent";
import { environment, type Environment, type Feature } from "../environment";
import type { TFuncKey } from "../i18n";
import { usePromise } from "../utils/usePromise";

type RootMenuItem = {
  id?: string;
  label: TFuncKey;
  path: string;
  isVisible?: keyof Feature;
  modulePath?: string;
};

type MenuItemWithChildren = {
  label: TFuncKey;
  children: MenuItem[];
  isVisible?: keyof Feature;
};

export type MenuItem = RootMenuItem | MenuItemWithChildren;

export const PageNav = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>();
  const context = useEnvironment<Environment>();

  usePromise((signal) => fetchContentJson({ signal, context }), setMenuItems);

  return (
    <nav
      aria-label="Account navigation"
      className="hidden w-60 shrink-0 overflow-y-auto border-r border-border bg-card px-3 py-4 md:block"
    >
      <Suspense fallback={<Spinner className="size-4" />}>
        <ul className="space-y-1">
          {menuItems
            ?.filter((menuItem) =>
              menuItem.isVisible
                ? context.environment.features[menuItem.isVisible]
                : true,
            )
            .map((menuItem) => (
              <NavMenuItem
                key={menuItem.label as string}
                menuItem={menuItem}
              />
            ))}
        </ul>
      </Suspense>
    </nav>
  );
};

type NavMenuItemProps = {
  menuItem: MenuItem;
};

function NavMenuItem({ menuItem }: NavMenuItemProps) {
  const { t } = useTranslation();
  const {
    environment: { features },
  } = useEnvironment<Environment>();
  const { pathname } = useLocation();
  const isActive = useMemo(
    () => matchMenuItem(pathname, menuItem),
    [pathname, menuItem],
  );

  if ("path" in menuItem) {
    return (
      <li>
        <NavLink path={menuItem.path} isActive={isActive}>
          {t(menuItem.label)}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <Collapsible defaultOpen={isActive}>
        <CollapsibleTrigger
          data-testid={menuItem.label}
          className={cn(
            "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
            isActive && "text-foreground",
          )}
        >
          {t(menuItem.label)}
          <CaretDownIcon className="size-3.5 transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-closed:animate-collapsible-up data-open:animate-collapsible-down">
          <ul className="mt-1 space-y-1 border-l border-border pl-3">
            {menuItem.children
              .filter((child) =>
                child.isVisible ? features[child.isVisible] : true,
              )
              .map((child) => (
                <NavMenuItem key={child.label as string} menuItem={child} />
              ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

function getFullUrl(path: string) {
  return `${new URL(environment.baseUrl).pathname}${path}`;
}

function matchMenuItem(currentPath: string, menuItem: MenuItem): boolean {
  if ("path" in menuItem) {
    return !!matchPath(getFullUrl(menuItem.path), currentPath);
  }
  return menuItem.children.some((child) => matchMenuItem(currentPath, child));
}

type NavLinkProps = {
  path: string;
  isActive: boolean;
};

export const NavLink = ({
  path,
  isActive,
  children,
}: PropsWithChildren<NavLinkProps>) => {
  const menuItemPath = getFullUrl(path) + location.search;
  const href = useHref(menuItemPath);
  const handleClick = useLinkClickHandler(menuItemPath);

  return (
    <a
      data-testid={path}
      href={href}
      onClick={(event) =>
        handleClick(event as unknown as ReactMouseEvent<HTMLAnchorElement>)
      }
      className={cn(
        "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-foreground/70 hover:text-foreground",
      )}
    >
      {children}
    </a>
  );
};
