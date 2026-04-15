/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/PermissionRequest.tsx" --revert
 */

import { UserCheckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@albatroaz/ui/components/badge";
import { Button } from "@albatroaz/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@albatroaz/ui/components/dialog";
import { fetchPermission, updateRequest } from "../api";
import type { Permission, Resource } from "../api/representations";
import { useEnvironment } from "../lib/shared";
import { useAccountAlerts } from "../utils/useAccountAlerts";

type Props = {
  resource: Resource;
  refresh: () => void;
};

export const PermissionRequest = ({ resource, refresh }: Props) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();
  const [open, setOpen] = useState(false);

  const approveDeny = async (
    shareRequest: Permission,
    approve: boolean = false,
  ) => {
    try {
      const permissions = await fetchPermission({ context }, resource._id);
      const { scopes, username } = permissions.find(
        (p) => p.username === shareRequest.username,
      ) || { scopes: [], username: shareRequest.username };

      await updateRequest(
        context,
        resource._id,
        username,
        approve
          ? [...(scopes as string[]), ...(shareRequest.scopes as string[])]
          : scopes,
      );
      addAlert(t("shareSuccess"));
      setOpen(false);
      refresh();
    } catch (error) {
      addError("shareError", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <UserCheckIcon className="size-5" />
          <Badge variant="secondary">{resource.shareRequests?.length}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("permissionRequest", { name: resource.name })}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium">
            <div>{t("requestor")}</div>
            <div>{t("permissionRequests")}</div>
            <div />
          </div>
          {resource.shareRequests?.map((shareRequest) => (
            <div
              key={shareRequest.username}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 border-t border-border px-4 py-3 text-sm first:border-t-0"
            >
              <div>
                <div>
                  {shareRequest.firstName} {shareRequest.lastName}{" "}
                  {shareRequest.lastName ? "" : shareRequest.username}
                </div>
                <div className="text-xs text-muted-foreground">
                  {shareRequest.email}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {shareRequest.scopes.map((scope) => (
                  <Badge key={scope.toString()} variant="secondary">
                    {scope as string}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approveDeny(shareRequest, true)}>
                  {t("accept")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => approveDeny(shareRequest)}
                >
                  {t("deny")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">{t("close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
