import type {
  UserProfileAttributeMetadata,
  UserProfileMetadata,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import type { TFunction } from "i18next";
import { type ReactNode, useMemo } from "react";
import {
  Controller,
  type FieldPath,
  type UseFormReturn,
} from "react-hook-form";
import { Checkbox } from "@albatroaz/ui/components/checkbox";
import { Input } from "@albatroaz/ui/components/input";
import { Label } from "@albatroaz/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@albatroaz/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@albatroaz/ui/components/select";
import { Textarea } from "@albatroaz/ui/components/textarea";
import {
  fieldName,
  label,
  type UserFormFields,
} from "../lib/shared";

const HTML5_TYPES = new Set([
  "html5-email",
  "html5-tel",
  "html5-url",
  "html5-number",
  "html5-range",
  "html5-datetime-local",
  "html5-date",
  "html5-month",
  "html5-time",
]);

type Props = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  userProfileMetadata: UserProfileMetadata;
  supportedLocales: string[];
  currentLocale: string;
  hideReadOnly?: boolean;
  renderer?: (
    attribute: UserProfileAttributeMetadata,
  ) => ReactNode | undefined;
};

export const UserProfileFields = ({
  t,
  form,
  userProfileMetadata,
  supportedLocales,
  currentLocale,
  hideReadOnly = false,
  renderer,
}: Props) => {
  const grouped = useMemo(() => {
    if (!userProfileMetadata.attributes) return [];
    const attributes = hideReadOnly
      ? userProfileMetadata.attributes.filter((a) => !a.readOnly)
      : userProfileMetadata.attributes;

    return [
      { name: undefined as string | undefined },
      ...(userProfileMetadata.groups ?? []),
    ].map((group) => ({
      group,
      attributes: attributes.filter((a) => a.group === group.name),
    }));
  }, [hideReadOnly, userProfileMetadata.groups, userProfileMetadata.attributes]);

  if (grouped.length === 0) return null;

  return (
    <div className="space-y-8">
      {grouped
        .filter((g) => g.attributes.length > 0)
        .map(({ group, attributes }) => (
          <fieldset
            key={group.name ?? "_default"}
            className="space-y-4 border-t border-border pt-6 first:border-t-0 first:pt-0"
          >
            {group.name ? (
              <legend className="text-base font-medium text-foreground">
                {label(t, group.displayHeader, group.name) || t("general")}
              </legend>
            ) : null}
            {group.displayDescription ? (
              <p className="text-sm text-muted-foreground">
                {label(t, group.displayDescription, "")}
              </p>
            ) : null}
            {attributes.map((attribute) => (
              <FieldRow
                key={attribute.name}
                attribute={attribute}
                t={t}
                form={form}
                supportedLocales={supportedLocales}
                currentLocale={currentLocale}
                renderer={renderer}
              />
            ))}
          </fieldset>
        ))}
    </div>
  );
};

type RowProps = {
  attribute: UserProfileAttributeMetadata;
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  supportedLocales: string[];
  currentLocale: string;
  renderer?: (
    attribute: UserProfileAttributeMetadata,
  ) => ReactNode | undefined;
};

function FieldRow(props: RowProps) {
  const { attribute, t, form, supportedLocales, renderer } = props;
  const name = fieldName(attribute.name);
  const error = getError(form, name);
  const isLocale = attribute.name === "locale";

  const labelText = label(t, attribute.displayName, attribute.name);
  const extra = renderer?.(attribute);

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={attribute.name}>
          {labelText}
          {attribute.required ? (
            <span className="ms-0.5 text-destructive">*</span>
          ) : null}
        </Label>
        {extra}
      </div>
      {isLocale ? (
        <LocaleField
          attribute={attribute}
          form={form}
          supportedLocales={supportedLocales}
          t={t}
        />
      ) : (
        <FieldByType {...props} />
      )}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function FieldByType({ attribute, form, t }: RowProps) {
  const inputType =
    (attribute.annotations?.inputType as string | undefined) ?? "text";
  const name = fieldName(attribute.name);

  if (inputType === "textarea") {
    return (
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Textarea
            id={attribute.name}
            disabled={attribute.readOnly}
            value={(field.value as string) ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
    );
  }

  if (inputType === "select" || inputType === "multiselect") {
    const options = getOptions(attribute);
    if (inputType === "multiselect") {
      return (
        <Controller
          control={form.control}
          name={name}
          render={({ field }) => {
            const values = (field.value as string[] | undefined) ?? [];
            return (
              <select
                id={attribute.name}
                multiple
                disabled={attribute.readOnly}
                value={values}
                className="w-full rounded-md border border-input bg-input/20 px-2 py-1 text-sm"
                onChange={(e) =>
                  field.onChange(
                    Array.from(e.target.selectedOptions).map((o) => o.value),
                  )
                }
                onBlur={field.onBlur}
              >
                {options.map((o) => (
                  <option key={o} value={o}>
                    {optionLabel(t, attribute, o)}
                  </option>
                ))}
              </select>
            );
          }}
        />
      );
    }
    return (
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select
            value={(field.value as string) ?? ""}
            disabled={attribute.readOnly}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={attribute.name}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {optionLabel(t, attribute, o)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  }

  if (inputType === "select-radiobuttons") {
    const options = getOptions(attribute);
    return (
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            value={(field.value as string) ?? ""}
            disabled={attribute.readOnly}
            onValueChange={field.onChange}
          >
            {options.map((o) => (
              <label
                key={o}
                htmlFor={`${attribute.name}-${o}`}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <RadioGroupItem value={o} id={`${attribute.name}-${o}`} />
                {optionLabel(t, attribute, o)}
              </label>
            ))}
          </RadioGroup>
        )}
      />
    );
  }

  if (inputType === "multiselect-checkboxes") {
    const options = getOptions(attribute);
    return (
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => {
          const values = (field.value as string[] | undefined) ?? [];
          return (
            <div className="space-y-2">
              {options.map((o) => (
                <label
                  key={o}
                  htmlFor={`${attribute.name}-${o}`}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    id={`${attribute.name}-${o}`}
                    disabled={attribute.readOnly}
                    checked={values.includes(o)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...values, o]
                        : values.filter((v) => v !== o);
                      field.onChange(next);
                    }}
                  />
                  {optionLabel(t, attribute, o)}
                </label>
              ))}
            </div>
          );
        }}
      />
    );
  }

  const htmlType = HTML5_TYPES.has(inputType) ? inputType.slice(6) : "text";

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <Input
          id={attribute.name}
          type={htmlType}
          disabled={attribute.readOnly}
          value={(field.value as string) ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

function LocaleField({
  attribute,
  form,
  supportedLocales,
  t,
}: {
  attribute: UserProfileAttributeMetadata;
  form: UseFormReturn<UserFormFields>;
  supportedLocales: string[];
  t: TFunction;
}) {
  if (supportedLocales.length === 0) return null;
  const name = fieldName(attribute.name);
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <Select
          value={(field.value as string) ?? ""}
          disabled={attribute.readOnly}
          onValueChange={field.onChange}
        >
          <SelectTrigger id={attribute.name}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedLocales.map((locale) => (
              <SelectItem key={locale} value={locale}>
                {t(`locale_${locale}`, { defaultValue: locale })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function getOptions(attribute: UserProfileAttributeMetadata): string[] {
  const fromValidation = attribute.annotations?.inputOptionsFromValidation as
    | string
    | undefined;
  if (fromValidation) {
    const validator = (
      attribute.validators as Record<string, { options?: string[] } | undefined>
    )[fromValidation];
    if (validator?.options) return validator.options;
  }
  const opts = (
    attribute.validators?.options as { options?: string[] } | undefined
  )?.options;
  return opts ?? [];
}

function optionLabel(
  t: TFunction,
  attribute: UserProfileAttributeMetadata,
  option: string,
) {
  const labels = attribute.annotations?.inputOptionLabels as
    | Record<string, string>
    | undefined;
  if (labels) return label(t, labels[option] ?? option);
  const prefix = attribute.annotations?.inputOptionLabelsI18nPrefix as
    | string
    | undefined;
  if (prefix) return t(`${prefix}.${option}`);
  return option;
}

function getError(
  form: UseFormReturn<UserFormFields>,
  name: FieldPath<UserFormFields>,
): string | undefined {
  const segments = name.split(/[.[\]]+/).filter(Boolean);
  let cur: unknown = form.formState.errors;
  for (const seg of segments) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  if (cur && typeof cur === "object" && "message" in cur) {
    const msg = (cur as { message?: unknown }).message;
    return typeof msg === "string" ? msg : undefined;
  }
  return undefined;
}
