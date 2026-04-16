import {
  GearIcon,
  InfoIcon,
  SignOutIcon,
  CaretUpDownIcon,
  TrashIcon,
  QuestionIcon,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@albatroaz/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@albatroaz/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@albatroaz/ui/components/sidebar";
import { useEnvironment, useHelp } from "./lib/shared";
import { useRealm } from "./context/realm-context/RealmContext";
import { useAccess } from "./context/access/Access";
import { toDashboard } from "./dashboard/routes/Dashboard";
import { useWhoAmI } from "./context/whoami/WhoAmI";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { keycloak, environment } = useEnvironment();
  const { t } = useTranslation();
  const { realm } = useRealm();
  const { hasAccess } = useAccess();
  const { whoAmI } = useWhoAmI();
  const { enabled, toggleHelp } = useHelp();

  const isMasterRealm = realm === "master";
  const isManager = hasAccess("manage-realm");
  const displayName = whoAmI?.displayName || "Admin";
  const initials = displayName
    .split(/\s+/)
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{realm}</span>
              </div>
              <CaretUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs">{realm}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => keycloak.accountManagement()}>
                <GearIcon />
                {t("manageAccount")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={toDashboard({ realm })}>
                  <InfoIcon />
                  {t("realmInfo")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleHelp}>
                <QuestionIcon />
                {enabled ? t("helpEnabled") : t("helpDisabled")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {isMasterRealm && isManager && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <TrashIcon />
                  {t("clearCachesTitle")}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => keycloak.logout()}>
              <SignOutIcon />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
