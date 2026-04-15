/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ShareTheResource.tsx" --revert
 */

import { XIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Badge } from "@albatroaz/ui/components/badge";
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
import { updateRequest } from "../api";
import type { Permission, Resource } from "../api/representations";
import { useEnvironment } from "../lib/shared";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { SharedWith } from "./SharedWith";

type Props = {
  resource: Resource;
  permissions?: Permission[];
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  permissions: string[];
  usernames: { value: string }[];
};

export const ShareTheResource = ({
  resource,
  permissions,
  open,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();
  const form = useForm<FormValues>({ mode: "onChange" });
  const {
    control,
    register,
    reset,
    formState: { errors, isValid },
    setError,
    clearErrors,
    handleSubmit,
  } = form;
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "usernames",
  });

  useEffect(() => {
    if (fields.length === 0) append({ value: "" });
  }, [fields, append]);

  const watchFields = useWatch({
    control,
    name: "usernames",
    defaultValue: [],
  });

  const isAddDisabled = watchFields.every(
    ({ value }) => value.trim().length === 0,
  );

  const validateUser = async () => {
    const userOrEmails = fields.map((f) => f.value).filter((f) => f !== "");
    const userPermission = permissions
      ?.map((p) => [p.username, p.email])
      .flat();

    const hasUsers = userOrEmails.length > 0;
    const alreadyShared =
      userOrEmails.filter((u) => userPermission?.includes(u)).length !== 0;

    if (!hasUsers || alreadyShared) {
      setError("usernames", {
        message: !hasUsers ? t("required") : t("resourceAlreadyShared"),
      });
    } else {
      clearErrors();
    }
    return hasUsers && !alreadyShared;
  };

  const addShare = async ({ usernames, permissions }: FormValues) => {
    try {
      await Promise.all(
        usernames
          .filter(({ value }) => value !== "")
          .map(({ value: username }) =>
            updateRequest(context, resource._id, username, permissions),
          ),
      );
      addAlert(t("shareSuccess"));
      onClose();
    } catch (error) {
      addError("shareError", error);
    }
    reset({});
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("shareTheResource", { name: resource.name })}
          </DialogTitle>
        </DialogHeader>

        <form
          id="share-form"
          onSubmit={handleSubmit(addShare)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="users">
              {t("shareUser")}
              <span className="ms-0.5 text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="users"
                data-testid="users"
                placeholder={t("usernamePlaceholder")}
                aria-invalid={!!errors.usernames}
                {...register(`usernames.${fields.length - 1}.value`, {
                  validate: validateUser,
                })}
              />
              <Button
                type="button"
                data-testid="add"
                onClick={() => append({ value: "" })}
                disabled={isAddDisabled}
              >
                {t("add")}
              </Button>
            </div>

            {fields.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground">
                  {t("shareWith")}
                </span>
                {fields.map(
                  (field, index) =>
                    index !== fields.length - 1 && (
                      <Badge
                        key={field.id}
                        variant="secondary"
                        className="gap-1 pe-1"
                      >
                        {field.value}
                        <button
                          type="button"
                          aria-label={t("remove")}
                          onClick={() => remove(index)}
                          className="rounded hover:bg-foreground/10"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ),
                )}
              </div>
            )}
            {errors.usernames && (
              <p className="text-xs text-destructive">
                {errors.usernames.message as string}
              </p>
            )}
          </div>

          <Controller
            control={control}
            name="permissions"
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
                          htmlFor={`share-scope-${name}`}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <Checkbox
                            id={`share-scope-${name}`}
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

          <SharedWith permissions={permissions} />
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="share-form"
            data-testid="done"
            disabled={!isValid}
          >
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
