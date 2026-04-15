/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ResourcesTab.tsx" --revert
 */

import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  DotsThreeVerticalIcon,
  PencilIcon,
  ShareNetworkIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@albatroaz/ui/components/badge";
import { Button } from "@albatroaz/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@albatroaz/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@albatroaz/ui/components/dropdown-menu";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { cn } from "@albatroaz/ui/lib/utils";
import { fetchPermission, fetchResources, updatePermissions } from "../api";
import { getPermissionRequests } from "../api/methods";
import type { Links } from "../api/parse-links";
import type { Permission, Resource } from "../api/representations";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useEnvironment } from "../lib/shared";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";
import { EditTheResource } from "./EditTheResource";
import { PermissionRequest } from "./PermissionRequest";
import { ResourceToolbar } from "./ResourceToolbar";
import { ShareTheResource } from "./ShareTheResource";
import { SharedWith } from "./SharedWith";

type PermissionDetail = {
  rowOpen?: boolean;
  shareDialogOpen?: boolean;
  editDialogOpen?: boolean;
  permissions?: Permission[];
};

type Props = {
  isShared?: boolean;
};

export const ResourcesTab = ({ isShared = false }: Props) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [params, setParams] = useState<Record<string, string>>({
    first: "0",
    max: "5",
  });
  const [links, setLinks] = useState<Links | undefined>();
  const [resources, setResources] = useState<Resource[]>();
  const [details, setDetails] = useState<
    Record<string, PermissionDetail | undefined>
  >({});
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    async (signal) => {
      const result = await fetchResources(
        { signal, context },
        params,
        isShared,
      );
      if (!isShared) {
        await Promise.all(
          result.data.map(
            async (r) =>
              (r.shareRequests = await getPermissionRequests(r._id, {
                signal,
                context,
              })),
          ),
        );
      }
      return result;
    },
    ({ data, links }) => {
      setResources(data);
      setLinks(links);
    },
    [params, key],
  );

  if (!resources) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  const fetchPermissions = async (id: string) => {
    let permissions = details[id]?.permissions || [];
    if (!details[id]) {
      permissions = await fetchPermission({ context }, id);
    }
    return permissions;
  };

  const removeShare = async (resource: Resource) => {
    try {
      const permissions = (await fetchPermissions(resource._id)).map(
        ({ username }) =>
          ({
            username,
            scopes: [],
          }) as Permission,
      );
      await updatePermissions(context, resource._id, permissions);
      setDetails({});
      addAlert(t("unShareSuccess"));
    } catch (error) {
      addError("unShareError", error);
    }
  };

  const toggleOpen = async (
    id: string,
    field: keyof PermissionDetail,
    open: boolean,
  ) => {
    const permissions = await fetchPermissions(id);
    setDetails({
      ...details,
      [id]: { ...details[id], [field]: open, permissions },
    });
  };

  return (
    <>
      <ResourceToolbar
        onFilter={(name) => setParams({ ...params, name })}
        count={resources.length}
        first={parseInt(params.first, 10)}
        max={parseInt(params.max, 10)}
        onNextClick={() => setParams(links?.next || {})}
        onPreviousClick={() => setParams(links?.prev || {})}
        onPerPageSelect={(first, max) =>
          setParams({ first: `${first}`, max: `${max}` })
        }
        hasNext={!!links?.next}
      />

      <div className="overflow-hidden rounded-md border border-border">
        <div
          className={cn(
            "grid gap-3 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground",
            isShared
              ? "grid-cols-[1fr_1fr_2fr]"
              : "grid-cols-[auto_1fr_1fr_2fr_auto]",
          )}
        >
          {!isShared && <div />}
          <div>{t("resourceName")}</div>
          <div>{t("application")}</div>
          <div>{!isShared ? t("permissionRequests") : t("permissions")}</div>
          {!isShared && <div />}
        </div>

        {resources.map((resource, index) => {
          const detail = details[resource._id];
          return (
            <Fragment key={resource.name}>
              <Collapsible
                open={detail?.rowOpen ?? false}
                onOpenChange={(o) => {
                  if (!isShared) toggleOpen(resource._id, "rowOpen", o);
                }}
                className="border-t border-border first:border-t-0"
              >
                <div
                  className={cn(
                    "grid items-center gap-3 px-4 py-3 text-sm",
                    isShared
                      ? "grid-cols-[1fr_1fr_2fr]"
                      : "grid-cols-[auto_1fr_1fr_2fr_auto]",
                  )}
                >
                  {!isShared && (
                    <CollapsibleTrigger asChild>
                      <Button
                        data-testid={`expand-${resource.name}`}
                        variant="ghost"
                        size="icon-sm"
                        className="group"
                      >
                        <CaretDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                  )}

                  <div data-testid={`row[${index}].name`}>{resource.name}</div>

                  <div>
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="h-auto gap-1.5 px-0"
                    >
                      <a
                        href={resource.client.baseUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {resource.client.name || resource.client.clientId}
                        <ArrowSquareOutIcon className="size-4" />
                      </a>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isShared &&
                      resource.shareRequests &&
                      resource.shareRequests.length > 0 && (
                        <PermissionRequest
                          resource={resource}
                          refresh={refresh}
                        />
                      )}
                    {isShared && resource.scopes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {resource.scopes.map((scope) => (
                          <Badge key={scope.name} variant="secondary">
                            {scope.displayName || scope.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <ShareTheResource
                      resource={resource}
                      permissions={detail?.permissions}
                      open={detail?.shareDialogOpen || false}
                      onClose={() => setDetails({})}
                    />
                    {detail?.editDialogOpen && (
                      <EditTheResource
                        resource={resource}
                        permissions={detail?.permissions}
                        onClose={() => setDetails({})}
                      />
                    )}
                  </div>

                  {!isShared && (
                    <div className="flex items-center gap-1">
                      <Button
                        data-testid={`share-${resource.name}`}
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          toggleOpen(resource._id, "shareDialogOpen", true)
                        }
                      >
                        <ShareNetworkIcon className="size-4" />
                        {t("share")}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <DotsThreeVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={detail?.permissions?.length === 0}
                            onSelect={() =>
                              toggleOpen(resource._id, "editDialogOpen", true)
                            }
                          >
                            <PencilIcon className="size-4" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={detail?.permissions?.length === 0}
                            onSelect={(e) => e.preventDefault()}
                            asChild
                          >
                            <ConfirmDialogMenuRow
                              onContinue={() => removeShare(resource)}
                              continueLabel={t("confirm")}
                              cancelLabel={t("cancel")}
                              modalTitle={t("unShare")}
                              description={t("unShareAllConfirm")}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                {!isShared && (
                  <CollapsibleContent className="bg-muted/20 px-4 py-3">
                    <SharedWith permissions={detail?.permissions} />
                  </CollapsibleContent>
                )}
              </Collapsible>
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

function ConfirmDialogMenuRow(props: {
  onContinue: () => void | Promise<void>;
  continueLabel: string;
  cancelLabel: string;
  modalTitle: string;
  description: string;
}) {
  const { t } = useTranslation();
  return (
    <ConfirmDialog
      buttonTitle={
        <span className="flex items-center gap-2">
          <TrashIcon className="size-4" />
          {t("unShare")}
        </span>
      }
      buttonVariant="ghost"
      buttonClassName="w-full justify-start"
      modalTitle={props.modalTitle}
      description={props.description}
      continueLabel={props.continueLabel}
      cancelLabel={props.cancelLabel}
      onContinue={props.onContinue}
    />
  );
}
