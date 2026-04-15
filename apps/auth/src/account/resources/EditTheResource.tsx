/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/EditTheResource.tsx" --revert
 */

import { Fragment, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@albatroaz/ui/components/button";
import { Checkbox } from "@albatroaz/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@albatroaz/ui/components/dialog";
import { Input } from "@albatroaz/ui/components/input";
import { Label } from "@albatroaz/ui/components/label";
import { updatePermissions } from "../api";
import type { Permission, Resource } from "../api/representations";
import { useEnvironment } from "../lib/shared";
import { useAccountAlerts } from "../utils/useAccountAlerts";

type Props = {
  resource: Resource;
  permissions?: Permission[];
  onClose: () => void;
};

type FormValues = {
  permissions: Permission[];
};

export const EditTheResource = ({
  resource,
  permissions,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const { control, reset, handleSubmit } = useForm<FormValues>();
  const { fields } = useFieldArray<FormValues, "permissions">({
    control,
    name: "permissions",
  });

  useEffect(() => {
    reset({ permissions });
  }, [permissions, reset]);

  const editShares = async ({ permissions }: FormValues) => {
    try {
      await Promise.all(
        permissions.map((permission) =>
          updatePermissions(context, resource._id, [permission]),
        ),
      );
      addAlert(t("updateSuccess"));
      onClose();
    } catch (error) {
      addError("updateError", error);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("editTheResource", { name: resource.name })}
          </DialogTitle>
        </DialogHeader>

        <form
          id="edit-form"
          onSubmit={handleSubmit(editShares)}
          className="space-y-4"
        >
          {fields.map((p, index) => (
            <Fragment key={p.id}>
              <div className="space-y-1.5">
                <Label htmlFor={`user-${p.id}`}>{t("user")}</Label>
                <Input id={`user-${p.id}`} value={p.username} disabled />
              </div>
              <Controller
                control={control}
                name={`permissions.${index}.scopes`}
                defaultValue={[]}
                render={({ field }) => {
                  const value = (field.value as string[] | undefined) ?? [];
                  return (
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-medium">
                        {t("permissions")}
                      </legend>
                      <div className="space-y-1">
                        {resource.scopes.map(({ name, displayName }) => {
                          const checked = value.includes(name);
                          return (
                            <label
                              key={name}
                              htmlFor={`scope-${p.id}-${name}`}
                              className="flex cursor-pointer items-center gap-2 text-sm"
                            >
                              <Checkbox
                                id={`scope-${p.id}-${name}`}
                                checked={checked}
                                onCheckedChange={(c) => {
                                  const next = c
                                    ? [...value, name]
                                    : value.filter((v) => v !== name);
                                  field.onChange(next);
                                }}
                              />
                              {displayName || name}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                }}
              />
            </Fragment>
          ))}
        </form>

        <DialogFooter>
          <Button type="submit" form="edit-form" id="done">
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
