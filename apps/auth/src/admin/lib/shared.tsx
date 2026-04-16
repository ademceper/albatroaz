import type { Keycloak } from "oidc-spa/keycloak-js";
import { Keycloak as KeycloakClient } from "oidc-spa/keycloak-js";
import React, {
  type ComponentType,
  type Context,
  createContext,
  type DependencyList,
  type FC,
  Fragment,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon, QuestionIcon } from "@phosphor-icons/react";
import { Button } from "@albatroaz/ui/components/button";
import { Checkbox } from "@albatroaz/ui/components/checkbox";
import { Input } from "@albatroaz/ui/components/input";
import { Label } from "@albatroaz/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@albatroaz/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@albatroaz/ui/components/select";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { Switch } from "@albatroaz/ui/components/switch";
import { Textarea } from "@albatroaz/ui/components/textarea";
import { Toaster } from "@albatroaz/ui/components/sonner";
import { cn } from "@albatroaz/ui/lib/utils";

/* ----------------------------- environment ------------------------------ */

export type BaseEnvironment = {
  serverBaseUrl: string;
  realm: string;
  clientId: string;
  resourceUrl: string;
  logo: string;
  logoUrl: string;
  scope?: string;
};

export function getInjectedEnvironment<T>(): T {
  const element = document.getElementById("environment");
  const contents = element?.textContent;
  if (typeof contents !== "string")
    throw new Error("Environment variables not found in the document.");
  try {
    return JSON.parse(contents);
  } catch {
    throw new Error("Unable to parse environment variables as JSON.");
  }
}

export type KeycloakContext<T extends BaseEnvironment = BaseEnvironment> = {
  environment: T;
  keycloak: Keycloak;
};

const KeycloakEnvContext = createContext<KeycloakContext | undefined>(undefined);

export const useEnvironment = <
  T extends BaseEnvironment = BaseEnvironment,
>(): KeycloakContext<T> => {
  const context = useContext(KeycloakEnvContext);
  if (!context) throw new Error("KeycloakProvider missing");
  return context as KeycloakContext<T>;
};

export const KeycloakProvider = <T extends BaseEnvironment>({
  environment,
  children,
}: PropsWithChildren<{ environment: T }>) => {
  const called = useRef(false);
  const [init, setInit] = useState(false);
  const [error, setError] = useState<unknown>();

  const keycloak = useMemo(
    () =>
      new KeycloakClient({
        url: environment.serverBaseUrl,
        realm: environment.realm,
        clientId: environment.clientId,
      }),
    [environment],
  );

  useEffect(() => {
    if (called.current) return;
    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        scope: environment.scope,
      })
      .then(() => setInit(true))
      .catch(setError);
    called.current = true;
  }, [keycloak, environment.scope]);

  if (error) {
    console.error(error);
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-destructive">Authentication error</p>
      </div>
    );
  }
  if (!init)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );

  return (
    <KeycloakEnvContext.Provider
      value={{ environment, keycloak } as KeycloakContext}
    >
      {children}
      <Toaster position="top-right" richColors closeButton />
    </KeycloakEnvContext.Provider>
  );
};

/* -------------------------------- alerts -------------------------------- */

export type AddAlertFunction = (
  message: string,
  variant?: string,
  description?: string,
) => void;
export type AddErrorFunction = (messageKey: string, error: unknown) => void;

export const useAlerts = () => {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      addAlert: ((message, variant, description) => {
        const opts = description ? { description } : undefined;
        if (variant === "danger") toast.error(message, opts);
        else if (variant === "warning") toast.warning(message, opts);
        else if (variant === "info") toast.info(message, opts);
        else toast.success(message, opts);
      }) as AddAlertFunction,
      addError: ((messageKey, error) => {
        const description = getErrorMessage(error) ?? undefined;
        toast.error(t(messageKey) as string, description ? { description } : undefined);
      }) as AddErrorFunction,
    }),
    [t],
  );
};

function getErrorMessage(error: unknown): string | null {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return null;
}

/* -------------------------------- utils --------------------------------- */

export const label = (
  t: (key: string) => string,
  text: string | undefined,
  fallback?: string,
  prefix?: string,
) => {
  const value = text || fallback;
  const isBundle = typeof value === "string" ? value.includes("${") : false;
  const unwrapped = isBundle ? value!.substring(2, value!.length - 1) : value;
  const key = prefix ? `${prefix}.${unwrapped}` : unwrapped;
  return t(key || "");
};

let idCounter = 0;
export const generateId = () => `id-${++idCounter}`;

export function createNamedContext<T>(
  name: string,
  defaultValue: T,
): Context<T> {
  const Ctx = createContext<T>(defaultValue);
  Ctx.displayName = name;
  return Ctx;
}

export function useRequiredContext<T>(ctx: Context<T | undefined>): T {
  const value = useContext(ctx);
  if (value === undefined) {
    throw new Error(`Missing context provider for ${ctx.displayName ?? ""}`);
  }
  return value;
}

export function useSetTimeout() {
  const ref = useRef<number[]>([]);
  useEffect(() => {
    const ids = ref.current;
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, []);
  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    ref.current.push(id);
  }, []);
}

export function useFetch<T>(
  factory: (signal: AbortSignal) => Promise<T>,
  callback: (value: T) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    factory(controller.signal)
      .then((result) => {
        if (!cancelled) callback(result);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") console.error(e);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* --------------------------------- help --------------------------------- */

type HelpCtx = {
  enabled: boolean;
  toggleHelp: () => void;
};
const HelpContext = createContext<HelpCtx>({ enabled: true, toggleHelp: () => {} });

export const Help: FC<PropsWithChildren> = ({ children }) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <HelpContext.Provider
      value={{ enabled, toggleHelp: () => setEnabled((v) => !v) }}
    >
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => useContext(HelpContext);

export const HelpItem = ({
  helpText,
  fieldLabelId: _id,
  noVerticalAlign: _nv,
}: {
  helpText: ReactNode;
  fieldLabelId?: string;
  noVerticalAlign?: boolean;
}) => {
  const { enabled } = useHelp();
  if (!enabled) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex size-4 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label="help"
        >
          <QuestionIcon className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm text-xs">{helpText}</PopoverContent>
    </Popover>
  );
};

/* -------------------------- form hook integration ----------------------- */

type BaseFormControlProps = {
  name: string;
  label?: ReactNode;
  labelIcon?: ReactNode;
  helperText?: ReactNode;
  helperTextInvalid?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
  "data-testid"?: string;
  rules?: Record<string, unknown>;
  controller?: { defaultValue?: unknown; rules?: Record<string, unknown> };
};

export const TextControl = ({
  name,
  label: lbl,
  labelIcon,
  helperText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  controller,
  rules,
  type = "text",
  ...rest
}: BaseFormControlProps & {
  type?: string;
  placeholder?: string;
}) => {
  const form = useFormContext();
  const id = name;
  const err = getFieldError(form?.formState?.errors, name);
  return (
    <div className={cn("space-y-1.5", className)}>
      {lbl ? (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id}>
            {lbl}
            {isRequired ? <span className="ms-0.5 text-destructive">*</span> : null}
          </Label>
          {labelIcon}
        </div>
      ) : null}
      <Controller
        control={form?.control}
        name={name}
        rules={controller?.rules ?? (rules as Record<string, unknown>)}
        defaultValue={controller?.defaultValue ?? ""}
        render={({ field }) => (
          <Input
            id={id}
            type={type}
            disabled={isDisabled}
            readOnly={isReadOnly}
            value={(field.value as string) ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={!!err}
            {...rest}
          />
        )}
      />
      {err ? (
        <p className="text-xs text-destructive">{err}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};

export const TextAreaControl = (
  props: BaseFormControlProps & { placeholder?: string; rows?: number },
) => {
  const form = useFormContext();
  const err = getFieldError(form?.formState?.errors, props.name);
  return (
    <div className={cn("space-y-1.5", props.className)}>
      {props.label ? (
        <Label htmlFor={props.name}>
          {props.label}
          {props.isRequired ? (
            <span className="ms-0.5 text-destructive">*</span>
          ) : null}
        </Label>
      ) : null}
      <Controller
        control={form?.control}
        name={props.name}
        rules={props.controller?.rules ?? props.rules}
        defaultValue={props.controller?.defaultValue ?? ""}
        render={({ field }) => (
          <Textarea
            id={props.name}
            disabled={props.isDisabled}
            readOnly={props.isReadOnly}
            rows={props.rows}
            placeholder={props.placeholder}
            value={(field.value as string) ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      {err ? <p className="text-xs text-destructive">{err}</p> : null}
    </div>
  );
};

export const NumberControl = (
  props: BaseFormControlProps & {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  },
) => (
  <TextControl
    {...props}
    type="number"
    {...{ min: props.min, max: props.max, step: props.step }}
  />
);

export type SwitchControlProps = BaseFormControlProps & {
  labelOn?: ReactNode;
  labelOff?: ReactNode;
  stringify?: boolean;
};

export const SwitchControl = ({
  name,
  label: lbl,
  labelOn,
  labelOff,
  isDisabled,
  className,
  stringify,
  controller,
}: SwitchControlProps) => {
  const form = useFormContext();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Controller
        control={form?.control}
        name={name}
        defaultValue={controller?.defaultValue ?? false}
        render={({ field }) => {
          const checked = stringify
            ? String(field.value) === "true"
            : Boolean(field.value);
          return (
            <>
              <Switch
                id={name}
                checked={checked}
                disabled={isDisabled}
                onCheckedChange={(v) =>
                  field.onChange(stringify ? (v ? "true" : "false") : v)
                }
              />
              {lbl ? (
                <Label htmlFor={name}>
                  {checked ? (labelOn ?? lbl) : (labelOff ?? lbl)}
                </Label>
              ) : null}
            </>
          );
        }}
      />
    </div>
  );
};

export type SelectControlOption = { key: string; value: ReactNode };
export type SelectControlProps = BaseFormControlProps & {
  options: SelectControlOption[] | string[];
  variant?: "single" | "typeahead" | "typeaheadMulti" | "checkbox";
  placeholderText?: ReactNode;
};

export enum SelectVariant {
  single = "single",
  typeahead = "typeahead",
  typeaheadMulti = "typeaheadMulti",
  checkbox = "checkbox",
}

export const SelectControl = ({
  name,
  label: lbl,
  labelIcon,
  options,
  isRequired,
  isDisabled,
  className,
  variant = "single",
  controller,
  placeholderText,
  helperText,
}: SelectControlProps) => {
  const form = useFormContext();
  const err = getFieldError(form?.formState?.errors, name);
  const normalizedOptions = useMemo<SelectControlOption[]>(
    () =>
      (options as Array<SelectControlOption | string>).map((o) =>
        typeof o === "string" ? { key: o, value: o } : o,
      ),
    [options],
  );
  const isMulti =
    variant === "typeaheadMulti" || variant === "checkbox";

  return (
    <div className={cn("space-y-1.5", className)}>
      {lbl ? (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={name}>
            {lbl}
            {isRequired ? <span className="ms-0.5 text-destructive">*</span> : null}
          </Label>
          {labelIcon}
        </div>
      ) : null}
      <Controller
        control={form?.control}
        name={name}
        defaultValue={controller?.defaultValue ?? (isMulti ? [] : "")}
        render={({ field }) => {
          if (isMulti) {
            const values = (field.value as string[] | undefined) ?? [];
            return (
              <div className="space-y-1">
                {normalizedOptions.map(({ key, value }) => {
                  const checked = values.includes(key);
                  return (
                    <label
                      key={key}
                      htmlFor={`${name}-${key}`}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        id={`${name}-${key}`}
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(c) => {
                          const next = c
                            ? [...values, key]
                            : values.filter((v) => v !== key);
                          field.onChange(next);
                        }}
                      />
                      {value}
                    </label>
                  );
                })}
              </div>
            );
          }
          return (
            <Select
              value={(field.value as string) ?? ""}
              onValueChange={field.onChange}
              disabled={isDisabled}
            >
              <SelectTrigger id={name}>
                <SelectValue placeholder={placeholderText as string} />
              </SelectTrigger>
              <SelectContent>
                {normalizedOptions.map(({ key, value }) => (
                  <SelectItem key={key} value={key}>
                    {value as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {err ? (
        <p className="text-xs text-destructive">{err}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};

export const PasswordControl = (
  props: BaseFormControlProps & { placeholder?: string },
) => {
  const [show, setShow] = useState(false);
  const form = useFormContext();
  const err = getFieldError(form?.formState?.errors, props.name);
  return (
    <div className={cn("space-y-1.5", props.className)}>
      {props.label ? (
        <Label htmlFor={props.name}>
          {props.label}
          {props.isRequired ? (
            <span className="ms-0.5 text-destructive">*</span>
          ) : null}
        </Label>
      ) : null}
      <Controller
        control={form?.control}
        name={props.name}
        rules={props.controller?.rules ?? props.rules}
        defaultValue={props.controller?.defaultValue ?? ""}
        render={({ field }) => (
          <div className="relative">
            <Input
              id={props.name}
              type={show ? "text" : "password"}
              disabled={props.isDisabled}
              readOnly={props.isReadOnly}
              placeholder={props.placeholder}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="pe-9"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? "hide password" : "show password"}
            >
              {show ? (
                <EyeSlashIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
        )}
      />
      {err ? <p className="text-xs text-destructive">{err}</p> : null}
    </div>
  );
};

export const PasswordInput = ({
  id,
  value,
  onChange,
  isDisabled,
  className,
  ...rest
}: {
  id?: string;
  value?: string;
  onChange?: (v: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  className?: string;
  [k: string]: unknown;
}) => {
  const [show, setShow] = useState(false);
  const { size: _size, ...inputRest } = rest as Record<string, unknown>;
  return (
    <div className={cn("relative", className)}>
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value ?? ""}
        disabled={isDisabled}
        onChange={(e) => onChange?.(e.target.value, e)}
        className="pe-9"
        {...(inputRest as Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">)}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={show ? "hide password" : "show password"}
      >
        {show ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
};

export const KeycloakTextArea = ({
  id,
  value,
  onChange,
  isDisabled,
  className,
  ...rest
}: {
  id?: string;
  value?: string;
  onChange?: (v: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
  className?: string;
  [k: string]: unknown;
}) => {
  const { size: _size, ...textareaRest } = rest as Record<string, unknown>;
  return (
    <Textarea
      id={id}
      value={value ?? ""}
      disabled={isDisabled}
      onChange={(e) => onChange?.(e.target.value, e)}
      className={className}
      {...(textareaRest as Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "onChange">)}
    />
  );
};

export type KeycloakTextAreaProps = ComponentType<unknown>;

/* ---------------------------- form support ----------------------------- */

export type FormErrorTextProps = {
  message: ReactNode;
  "data-testid"?: string;
};

export const FormErrorText = ({ message, "data-testid": testId }: FormErrorTextProps) => (
  <p className="text-xs text-destructive" data-testid={testId}>
    {message}
  </p>
);

export const FormPanel = ({
  title,
  children,
  className,
  isFlat: _isFlat,
}: {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  isFlat?: boolean;
}) => (
  <section className={cn("space-y-4 rounded-md border border-border p-4", className)}>
    {title ? (
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    ) : null}
    {children}
  </section>
);

export type FormSubmitButtonProps = {
  formState?: { isDirty: boolean; isSubmitting: boolean };
  children?: ReactNode;
  allowInvalid?: boolean;
  allowNonDirty?: boolean;
  "data-testid"?: string;
};

export const FormSubmitButton = ({
  formState,
  children,
  "data-testid": testId,
}: FormSubmitButtonProps) => (
  <Button
    type="submit"
    disabled={formState ? !formState.isDirty || formState.isSubmitting : false}
    data-testid={testId}
  >
    {children}
  </Button>
);

/* ------------------------------- spinner ------------------------------- */

export const KeycloakSpinner = ({ className }: { className?: string }) => (
  <div className={cn("flex justify-center py-6", className)}>
    <Spinner className="size-6" />
  </div>
);

/* ---------------------------- list empty state ------------------------- */

export type ListEmptyStateProps = {
  message: string;
  instructions?: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  icon?: ReactNode;
  hasIcon?: boolean;
  isSearchVariant?: boolean;
  secondaryActions?: Array<{ text: string; onClick?: () => void }>;
  className?: string;
  "data-testid"?: string;
};

export const ListEmptyState = ({
  message,
  instructions,
  primaryActionText,
  onPrimaryAction,
  icon,
  className,
  "data-testid": testId,
}: ListEmptyStateProps) => (
  <div
    data-testid={testId}
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 px-6 py-12 text-center",
      className,
    )}
  >
    {icon ? <div className="text-3xl text-muted-foreground">{icon}</div> : null}
    <p className="text-base font-medium text-foreground">{message}</p>
    {instructions ? (
      <p className="max-w-md text-sm text-muted-foreground">{instructions}</p>
    ) : null}
    {primaryActionText && onPrimaryAction ? (
      <Button onClick={onPrimaryAction}>{primaryActionText}</Button>
    ) : null}
  </div>
);

/* ------------------------------- table helpers ------------------------- */

export type Action<T = unknown> = {
  title: string;
  onRowClick?: (row: T) => void | Promise<unknown>;
  isSeparator?: boolean;
  isDisabled?: boolean;
  tooltipProps?: unknown;
  tooltip?: ReactNode;
};

export type Field<T = unknown> = {
  name: string;
  displayKey?: string;
  cellFormatters?: Array<() => unknown>;
  cellRenderer?: (row: T) => ReactNode;
  transforms?: Array<() => unknown>;
};

export type DetailField<T = unknown> = {
  name: string;
  enabled?: (row: T) => boolean;
  cellRenderer?: (row: T) => ReactNode;
};

export type LoaderFunction<T = unknown> = (
  first?: number,
  max?: number,
  search?: string,
) => Promise<T[]>;

export type KeycloakDataTableProps<T = unknown> = {
  loader: LoaderFunction<T> | T[];
  ariaLabelKey?: string;
  searchPlaceholderKey?: string;
  toolbarItem?: ReactNode;
  subToolbar?: ReactNode;
  actions?: Array<Action<T>>;
  actionResolver?: (rowData: { data: T }) => Array<Action<T>>;
  columns: Array<Field<T>>;
  detailColumns?: Array<DetailField<T>>;
  emptyState?: ReactNode;
  isSearching?: boolean;
  isPaginated?: boolean;
  isNotCompact?: boolean;
  onSelect?: (rows: T[]) => void;
  canSelectAll?: boolean;
  isRowDisabled?: (row: T) => boolean;
  rowContextMenu?: ReactNode;
  isRadio?: boolean;
  renderer?: (row: T, rowIndex: number) => ReactNode;
  className?: string;
  "data-testid"?: string;
};

export function KeycloakDataTable<T>({
  loader,
  columns,
  toolbarItem,
  subToolbar,
  emptyState,
  ariaLabelKey: _aria,
  searchPlaceholderKey,
  actions,
  actionResolver,
  className,
}: KeycloakDataTableProps<T>) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (typeof loader === "function") {
          const result = await loader(0, 20, search);
          if (mounted) setRows(result);
        } else if (Array.isArray(loader)) {
          if (mounted) setRows(loader);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loader, search]);

  if (loading) return <KeycloakSpinner />;
  if (rows.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        {searchPlaceholderKey ? (
          <Input
            placeholder={t(searchPlaceholderKey) as string}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">{toolbarItem}</div>
      </div>
      {subToolbar}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.name}
                  className="h-10 px-3 text-left text-xs font-medium text-foreground/80"
                >
                  {c.displayKey ? (t(c.displayKey) as string) : c.name}
                </th>
              ))}
              {actions || actionResolver ? <th className="w-px" /> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-t border-border hover:bg-muted/30"
              >
                {columns.map((c) => (
                  <td key={c.name} className="px-3 py-2">
                    {c.cellRenderer
                      ? c.cellRenderer(row)
                      : ((row as Record<string, unknown>)[c.name] as ReactNode)}
                  </td>
                ))}
                {actions || actionResolver ? (
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {(actionResolver
                        ? actionResolver({ data: row })
                        : (actions ?? [])
                      ).map((a, j) =>
                        a.isSeparator ? null : (
                          <Button
                            key={j}
                            variant="ghost"
                            size="sm"
                            disabled={a.isDisabled}
                            onClick={() => a.onRowClick?.(row)}
                          >
                            {a.title}
                          </Button>
                        ),
                      )}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const PaginatingTableToolbar = ({
  children,
  toolbarItem,
  count: _count,
  first: _first,
  max: _max,
  onNextClick: _onNext,
  onPreviousClick: _onPrev,
  onPerPageSelect: _onPerPage,
  id: _id,
  inputGroupName: _ign,
  inputGroupPlaceholder: _igp,
  inputGroupOnEnter: _igoe,
  searchTypeComponent: _stc,
}: {
  children?: ReactNode;
  toolbarItem?: ReactNode;
  count?: number;
  first?: number;
  max?: number;
  onNextClick?: (p: number) => void;
  onPreviousClick?: (p: number) => void;
  onPerPageSelect?: (n: number, f: number) => void;
  id?: string;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnEnter?: (search: string) => void;
  searchTypeComponent?: ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between gap-3">{toolbarItem}</div>
    {children}
  </div>
);

export const TableToolbar = ({
  children,
  toolbarItem,
  searchTypeComponent: _stc,
  inputGroupName: _ign,
  inputGroupPlaceholder,
  inputGroupOnEnter,
}: {
  children?: ReactNode;
  toolbarItem?: ReactNode;
  searchTypeComponent?: ReactNode;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnEnter?: (search: string) => void;
}) => {
  const [v, setV] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        {inputGroupPlaceholder ? (
          <Input
            placeholder={inputGroupPlaceholder}
            value={v}
            onChange={(e) => setV(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputGroupOnEnter?.(v);
            }}
            className="max-w-xs"
          />
        ) : null}
        {toolbarItem}
      </div>
      {children}
    </div>
  );
};

/* -------------------------- scroll-form (tabbed) ------------------------ */

export const mainPageContentId = "kc-main-content-page-container";

export const ScrollForm = ({
  sections,
  className,
  label: _label,
  borders: _b,
}: {
  sections: Array<{ title: string; id?: string; panel: ReactNode; isHidden?: boolean }>;
  className?: string;
  label?: string;
  borders?: boolean;
}) => (
  <div className={cn("space-y-10", className)}>
    {sections
      .filter((s) => !s.isHidden)
      .map((section, i) => (
        <section key={section.id ?? i} id={section.id} className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            {section.title}
          </h2>
          {section.panel}
        </section>
      ))}
  </div>
);

/* ------------------------------ select -------------------------------- */

export type Variant = "single" | "typeahead" | "typeaheadMulti" | "checkbox";
export type KeycloakSelectProps = {
  toggleId?: string;
  variant?: Variant;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onSelect?: (event: unknown, value: unknown) => void;
  selections?: unknown;
  placeholderText?: ReactNode;
  isDisabled?: boolean;
  children?: ReactNode;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const KeycloakSelect = ({
  toggleId,
  onToggle,
  onSelect,
  selections,
  placeholderText,
  isDisabled,
  children,
}: KeycloakSelectProps) => {
  return (
    <Select
      value={
        typeof selections === "string" ? selections : undefined
      }
      onValueChange={(v) => {
        onSelect?.({}, v);
        onToggle?.(false);
      }}
      disabled={isDisabled}
    >
      <SelectTrigger id={toggleId}>
        <SelectValue placeholder={placeholderText as string} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
};

/* -------------------------- error boundary ---------------------------- */

export type FallbackProps = { error?: Error | unknown; resetErrorBoundary?: () => void };

type ErrorBoundaryState = { error: Error | null };
type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ComponentType<FallbackProps>;
  error?: Error | unknown;
  resetErrorBoundary?: () => void;
}>;

export class ErrorBoundaryFallback extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback;
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            resetErrorBoundary={() => this.setState({ error: null })}
          />
        );
      }
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {this.state.error.message}
          </p>
          <Button onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ErrorBoundaryProvider: FC<PropsWithChildren> = ({ children }) => (
  <Fragment>{children}</Fragment>
);

export const useErrorBoundary = () => ({
  showBoundary: (err: unknown) => {
    throw err;
  },
});

/* ----------------------------- misc utils ----------------------------- */

export const isDefined = <T,>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export function useStoredState<T>(
  storage: Storage,
  key: string,
  initial: T,
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  return [
    value,
    (v: T) => {
      setValue(v);
      try {
        storage.setItem(key, JSON.stringify(v));
      } catch {
        /* ignore */
      }
    },
  ];
}

export function useUpdateEffect(effect: () => void, deps: DependencyList) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ---------------------------- errors utils ---------------------------- */

export function getErrorDescription(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "responseData" in error &&
    (error as { responseData: unknown }).responseData
  ) {
    return getNetworkErrorDescription(
      (error as { responseData: unknown }).responseData,
    );
  }
  return undefined;
}

export function getNetworkErrorDescription(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error_description" in data &&
    typeof (data as Record<string, unknown>).error_description === "string"
  ) {
    return (data as Record<string, string>).error_description;
  }
}

export function getNetworkErrorMessage(data: unknown) {
  if (typeof data !== "object" || data === null) return;
  for (const key of ["error", "errorMessage"]) {
    const v = (data as Record<string, unknown>)[key];
    if (typeof v === "string") return v;
  }
}

export { getErrorMessage };

/* --------------------------- field helpers ---------------------------- */

function getFieldError(
  errors: FieldValues | undefined,
  name: string,
): string | undefined {
  if (!errors) return undefined;
  const segments = name.split(".");
  let cur: unknown = errors;
  for (const seg of segments) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  if (cur && typeof cur === "object" && "message" in cur) {
    const m = (cur as { message?: unknown }).message;
    return typeof m === "string" ? m : undefined;
  }
  return undefined;
}

/* ------------------ user profile utils (shared with account) ----------- */

export const beerify = <T extends string>(name: T) =>
  name.replaceAll(".", "🍺");
export const debeerify = <T extends string>(name: T) =>
  name.replaceAll("🍺", ".");

type UserProfileError = {
  responseData: { errors?: Array<{ field: string; errorMessage: string; params?: unknown[] }> };
};

export function setUserProfileServerError<T>(
  error: UserProfileError,
  setError: (field: keyof T, params: object) => void,
  t: (key: string, params?: unknown) => string,
) {
  const errs =
    error.responseData?.errors ??
    ([error.responseData] as Array<{ field: string; errorMessage: string }>);
  errs.forEach((e) =>
    setError(e.field as keyof T, {
      message: t(e.errorMessage, { defaultValue: e.errorMessage || e.field }),
      type: "server",
    }),
  );
}

export type UserFormFields = FieldValues & {
  attributes?: Record<string, string | string[]>;
};

export const fieldName = (name?: string) =>
  `attributes.${(name ?? "").replaceAll(".", "🍺")}` as FieldPath<UserFormFields>;

/* ============================================================
 * Additional admin shared stubs
 * ============================================================ */

export const ContinueCancelModal = ({
  buttonTitle,
  modalTitle,
  continueLabel,
  cancelLabel,
  onContinue,
  buttonVariant: _bv,
  component: _component,
  isDisabled,
  children,
  ...rest
}: {
  buttonTitle?: ReactNode;
  modalTitle?: ReactNode;
  continueLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onContinue?: () => void;
  buttonVariant?: string;
  component?: ComponentType<unknown>;
  isDisabled?: boolean;
  children?: ReactNode;
  [k: string]: unknown;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        disabled={isDisabled}
        variant="secondary"
        onClick={() => setOpen(true)}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {buttonTitle}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-md bg-card p-4 shadow-xl">
            {modalTitle ? (
              <h2 className="text-base font-semibold">{modalTitle}</h2>
            ) : null}
            <div className="text-sm">{children}</div>
            <div className="flex justify-end gap-2">
              <Button
                variant="link"
                onClick={() => setOpen(false)}
              >
                {cancelLabel ?? "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  onContinue?.();
                  setOpen(false);
                }}
              >
                {continueLabel ?? "Continue"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const FileUploadControl = ({
  name,
  label: lbl,
  isDisabled,
  className,
}: {
  name: string;
  label?: ReactNode;
  isDisabled?: boolean;
  className?: string;
  [k: string]: unknown;
}) => {
  const form = useFormContext();
  return (
    <div className={cn("space-y-1.5", className)}>
      {lbl ? <Label htmlFor={name}>{lbl}</Label> : null}
      <Controller
        control={form?.control}
        name={name}
        defaultValue=""
        render={({ field }) => (
          <input
            id={name}
            type="file"
            disabled={isDisabled}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              field.onChange(text);
            }}
            className="text-sm"
          />
        )}
      />
    </div>
  );
};

export const IconMapper = ({ icon, size: _size }: { icon: string; size?: string }) => (
  <span
    aria-label={icon}
    className="inline-flex size-5 items-center justify-center rounded bg-muted text-[10px] font-semibold uppercase text-muted-foreground"
  >
    {icon.slice(0, 2)}
  </span>
);

export function isUserProfileError(error: unknown): boolean {
  return !!(
    error &&
    typeof error === "object" &&
    "responseData" in error
  );
}

export const KeycloakMasthead = ({
  brand,
  toolbarItems,
  dropdownItems,
  features: _features,
  keycloak: _keycloak,
  className,
  kebabDropdownItems: _kebab,
  toolbar: _toolbar,
  ...rest
}: {
  brand?: { src?: string; alt?: string; href?: string; className?: string };
  toolbarItems?: ReactNode[];
  dropdownItems?: ReactNode[];
  features?: Record<string, boolean>;
  keycloak?: unknown;
  className?: string;
  kebabDropdownItems?: ReactNode[];
  toolbar?: ReactNode;
  [k: string]: unknown;
}) => (
  <header
    className={cn(
      "flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-4",
      className,
    )}
    {...(rest as object)}
  >
    {brand ? (
      <a href={brand.href} className="flex items-center gap-2">
        <img src={brand.src} alt={brand.alt} className={cn("h-7", brand.className)} />
      </a>
    ) : (
      <div />
    )}
    <div className="flex items-center gap-2">
      {toolbarItems}
      {dropdownItems}
    </div>
  </header>
);

export const OrganizationTable = ({
  loader,
  link,
  toolbarItems,
  children,
  className,
}: {
  loader?: unknown;
  link?: (props: { children: ReactNode; href?: string }) => ReactNode;
  toolbarItems?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => {
  const data = Array.isArray(loader) ? (loader as Array<Record<string, unknown>>) : [];
  if (data.length === 0) return <>{children}</>;
  return (
    <div className={cn("space-y-3", className)}>
      {toolbarItems ? <div className="flex items-center gap-2">{toolbarItems}</div> : null}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="h-10 px-3 text-left text-xs font-medium">Name</th>
              <th className="h-10 px-3 text-left text-xs font-medium">Alias</th>
              <th className="h-10 px-3 text-left text-xs font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((org, i) => (
              <tr key={(org.id as string) ?? i} className="border-t border-border">
                <td className="px-3 py-2">
                  {link ? link({ children: org.name as ReactNode }) : (org.name as ReactNode)}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{org.alias as ReactNode}</td>
                <td className="px-3 py-2 text-muted-foreground">{org.description as ReactNode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const UserProfileFields = ({
  form,
  userProfileMetadata,
  className,
  hideReadOnly: _hr,
  supportedLocales: _sl,
  currentLocale: _cl,
  t: _t,
  renderer,
  config: _config,
}: {
  form?: unknown;
  userProfileMetadata?: { attributes?: Array<Record<string, unknown>> };
  className?: string;
  hideReadOnly?: boolean;
  supportedLocales?: string[];
  currentLocale?: string;
  t?: unknown;
  renderer?: (attribute: Record<string, unknown>) => ReactNode;
  config?: unknown;
}) => {
  const formCtx = useFormContext();
  const attributes = userProfileMetadata?.attributes ?? [];
  return (
    <div className={cn("space-y-4", className)}>
      {attributes.map((attr) => {
        const name = attr.name as string;
        const displayName = (attr.displayName as string) ?? name;
        const required = !!attr.required;
        const readOnly = !!attr.readOnly;
        const extra = renderer?.(attr);
        return (
          <div key={name} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor={name}>
                {displayName}
                {required ? (
                  <span className="ms-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              {extra}
            </div>
            <Controller
              control={(form as { control?: unknown })?.control as never ?? formCtx?.control}
              name={`attributes.${name.replaceAll(".", "🍺")}`}
              defaultValue=""
              render={({ field }) => (
                <Input
                  id={name}
                  disabled={readOnly}
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
