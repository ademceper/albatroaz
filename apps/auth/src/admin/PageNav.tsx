import {
  BuildingsIcon,
  ClockIcon,
  GearIcon,
  GlobeIcon,
  KeyIcon,
  ListBulletsIcon,
  ShieldCheckIcon,
  StackIcon,
  TreeStructureIcon,
  UsersIcon,
  UsersThreeIcon,
  FlowArrowIcon,
  PuzzlePieceIcon,
  LockIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@albatroaz/ui/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@albatroaz/ui/components/sidebar";
import { Badge } from "@albatroaz/ui/components/badge";
import { label, useEnvironment } from "./lib/shared";
import { useAccess } from "./context/access/Access";
import { useRealm } from "./context/realm-context/RealmContext";
import { useServerInfo } from "./context/server-info/ServerInfoProvider";
import type { Environment } from "./environment";
import { toPage } from "./page/routes";
import { routes } from "./routes";
import useIsFeatureEnabled, { Feature } from "./utils/useIsFeatureEnabled";
import logoSvgUrl from "./assets/logo.svg";
import { NavUser } from "./NavUser";

type NavItemDef = {
  title: string;
  path: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  id?: string;
};

function useNavAccess(item: NavItemDef) {
  const { hasAccess } = useAccess();
  const route = routes.find(
    (r) =>
      r.path?.replace(/\/:.+?(\?|(?:(?!\/).)*|$)/g, "") ===
      (item.id || item.path),
  );
  if (!route) return false;
  return route.handle?.access instanceof Array
    ? hasAccess(...route.handle.access)
    : hasAccess(route.handle?.access);
}

function SidebarNavItem({ item }: { item: NavItemDef }) {
  const { t } = useTranslation();
  const { realm } = useRealm();
  const allowed = useNavAccess(item);
  if (!allowed) return null;
  const encodedRealm = encodeURIComponent(realm);
  const Icon = item.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={t(item.title)}>
        <NavLink to={`/${encodedRealm}${item.path}`}>
          {Icon ? <Icon className="size-4" /> : null}
          <span>{t(item.title)}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

type NavGroupDef = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  items: NavItemDef[];
};

function SidebarNavGroup({ group }: { group: NavGroupDef }) {
  const { t } = useTranslation();
  const Icon = group.icon;
  return (
    <Collapsible defaultOpen asChild>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={t(group.label)}>
          <span>
            <Icon className="size-4" />
            <span>{t(group.label)}</span>
          </span>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <CaretRightIcon />
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.items.map((item) => (
              <SidebarNavSubItem key={item.path} item={item} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SidebarNavSubItem({ item }: { item: NavItemDef }) {
  const { t } = useTranslation();
  const { realm } = useRealm();
  const allowed = useNavAccess(item);
  if (!allowed) return null;
  const encodedRealm = encodeURIComponent(realm);
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <NavLink to={`/${encodedRealm}${item.path}`}>
          <span>{t(item.title)}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export const PageNav = () => {
  const { t } = useTranslation();
  const { environment } = useEnvironment<Environment>();
  const { hasSomeAccess, hasAccess } = useAccess();
  const { componentTypes } = useServerInfo();
  const isFeatureEnabled = useIsFeatureEnabled();
  const pages =
    componentTypes?.["org.keycloak.services.ui.extend.UiPageProvider"];
  const { realm, realmRepresentation } = useRealm();

  const showManage = hasSomeAccess(
    "view-realm",
    "query-groups",
    "query-users",
    "query-clients",
    "view-events",
  );
  const showConfigure = hasSomeAccess(
    "view-realm",
    "query-clients",
    "view-identity-providers",
  );
  const showWorkflows =
    hasAccess("manage-realm") && isFeatureEnabled(Feature.Workflows);
  const showManageRealm = environment.masterRealm === environment.realm;

  const manageItems: NavItemDef[] = [
    ...(isFeatureEnabled(Feature.Organizations) &&
    realmRepresentation?.organizationsEnabled
      ? [{ title: "organizations", path: "/organizations", icon: BuildingsIcon }]
      : []),
    { title: "clients", path: "/clients", icon: StackIcon },
    { title: "clientScopes", path: "/client-scopes", icon: PuzzlePieceIcon },
    { title: "realmRoles", path: "/roles", icon: ShieldCheckIcon },
    { title: "users", path: "/users", icon: UsersIcon },
    { title: "groups", path: "/groups", icon: UsersThreeIcon },
    { title: "sessions", path: "/sessions", icon: ClockIcon },
    { title: "events", path: "/events", icon: ListBulletsIcon },
  ];

  const configureItems: NavItemDef[] = [
    { title: "realmSettings", path: "/realm-settings", icon: GearIcon },
    { title: "authentication", path: "/authentication", icon: KeyIcon },
    ...(isFeatureEnabled(Feature.AdminFineGrainedAuthzV2) &&
    realmRepresentation?.adminPermissionsEnabled
      ? [{ title: "permissions", path: "/permissions", icon: LockIcon }]
      : []),
    { title: "identityProviders", path: "/identity-providers", icon: GlobeIcon },
    {
      title: "userFederation",
      path: "/user-federation",
      icon: TreeStructureIcon,
    },
    ...(showWorkflows
      ? [{ title: "workflows", path: "/workflows", icon: FlowArrowIcon }]
      : []),
    ...(isFeatureEnabled(Feature.DeclarativeUI) && pages
      ? pages.map((p) => ({
          title: p.id,
          path: toPage({ providerId: p.id }).pathname!,
          id: "/page-section",
        }))
      : []),
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={logoSvgUrl} alt="logo" className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {label(t, realmRepresentation?.displayName, realm)}
                  </span>
                  <span className="truncate text-xs">
                    <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                      {t("currentRealm")}
                    </Badge>
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {showManageRealm && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarNavItem
                item={{ title: "manageRealms", path: "/realms" }}
              />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {showManage && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("manage")}</SidebarGroupLabel>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarNavItem key={item.path} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {showConfigure && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("configure")}</SidebarGroupLabel>
            <SidebarMenu>
              {configureItems.map((item) => (
                <SidebarNavItem key={item.path} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
