import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  createContext,
  useContext,
  useId,
  useState,
} from "react";
import { XIcon } from "@phosphor-icons/react";
import { Alert as SAlert, AlertDescription, AlertTitle } from "@albatroaz/ui/components/alert";
import { Badge as SBadgePrimitive } from "@albatroaz/ui/components/badge";
import { Button as SButton } from "@albatroaz/ui/components/button";
import { Checkbox as SCheckbox } from "@albatroaz/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@albatroaz/ui/components/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@albatroaz/ui/components/dialog";
import { Input } from "@albatroaz/ui/components/input";
import { Label as SLabel } from "@albatroaz/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@albatroaz/ui/components/radio-group";
import { Separator } from "@albatroaz/ui/components/separator";
import { Switch as SSwitch } from "@albatroaz/ui/components/switch";
import {
  Tabs as STabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@albatroaz/ui/components/tabs";
import { Textarea } from "@albatroaz/ui/components/textarea";
import {
  Tooltip as STooltip,
  TooltipContent,
  TooltipTrigger,
} from "@albatroaz/ui/components/tooltip";
import { cn } from "@albatroaz/ui/lib/utils";

export enum ButtonVariant {
  primary = "primary",
  secondary = "secondary",
  tertiary = "tertiary",
  link = "link",
  plain = "plain",
  danger = "danger",
  warning = "warning",
  control = "control",
}

type ButtonProps = {
  variant?: keyof typeof ButtonVariant | ButtonVariant | "primary" | "secondary" | "tertiary" | "link" | "plain" | "danger" | "warning" | "control";
  isDisabled?: boolean;
  isLoading?: boolean;
  isInline?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right" | "start" | "end";
  component?: string | React.ComponentType<{ children?: ReactNode; [k: string]: unknown }>;
  isSmall?: boolean;
  size?: "default" | "sm" | "lg";
  children?: ReactNode;
  className?: string;
  isDanger?: boolean;
  type?: "button" | "submit" | "reset";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">;

const mapButtonVariant = (
  v?: ButtonProps["variant"],
): ComponentProps<typeof SButton>["variant"] => {
  switch (v) {
    case "primary":
      return "default";
    case "secondary":
    case "tertiary":
    case "control":
      return "outline";
    case "link":
      return "link";
    case "plain":
      return "ghost";
    case "danger":
    case "warning":
      return "destructive";
    default:
      return "default";
  }
};

export const Button = ({
  variant,
  isDisabled,
  isLoading: _isLoading,
  isInline: _isInline,
  icon,
  iconPosition = "left",
  component,
  isSmall,
  size,
  children,
  className,
  isDanger,
  type = "button",
  ...rest
}: ButtonProps) => {
  const btnVariant = isDanger ? "destructive" : mapButtonVariant(variant);
  const btnSize = isSmall ? "sm" : size ?? "default";

  if (component === "a" || typeof component === "function") {
    const Comp = component as React.ComponentType<{
      children?: ReactNode;
      className?: string;
    }>;
    return (
      <SButton asChild variant={btnVariant} size={btnSize} className={className}>
        <Comp {...(rest as unknown as Record<string, unknown>)}>
          {iconPosition === "right" || iconPosition === "end" ? (
            <>
              {children}
              {icon}
            </>
          ) : (
            <>
              {icon}
              {children}
            </>
          )}
        </Comp>
      </SButton>
    );
  }

  return (
    <SButton
      type={type}
      variant={btnVariant}
      size={btnSize}
      disabled={isDisabled}
      className={className}
      {...rest}
    >
      {iconPosition === "right" || iconPosition === "end" ? (
        <>
          {children}
          {icon}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </SButton>
  );
};

export enum AlertVariant {
  success = "success",
  danger = "danger",
  warning = "warning",
  info = "info",
  custom = "custom",
}

type AlertProps = {
  variant?: keyof typeof AlertVariant | AlertVariant;
  title?: ReactNode;
  isInline?: boolean;
  actionLinks?: ReactNode;
  customIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Alert = ({
  variant,
  title,
  actionLinks,
  children,
  className,
}: AlertProps) => (
  <SAlert
    variant={variant === "danger" ? "destructive" : "default"}
    className={className}
  >
    {title ? <AlertTitle>{title}</AlertTitle> : null}
    {children ? <AlertDescription>{children}</AlertDescription> : null}
    {actionLinks ? <div className="mt-2">{actionLinks}</div> : null}
  </SAlert>
);

export enum ModalVariant {
  small = "small",
  medium = "medium",
  large = "large",
  default = "default",
}

type ModalProps = {
  variant?: keyof typeof ModalVariant | ModalVariant;
  title?: ReactNode;
  titleIconVariant?: "success" | "danger" | "warning" | "info";
  description?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  actions?: ReactNode[];
  showClose?: boolean;
  children?: ReactNode;
  className?: string;
  "data-testid"?: string;
  "aria-label"?: string;
};

const modalSizeMap: Record<string, string> = {
  small: "max-w-sm",
  medium: "max-w-2xl",
  large: "max-w-4xl",
  default: "max-w-2xl",
};

export const Modal = ({
  variant = "medium",
  title,
  description,
  isOpen,
  onClose,
  actions,
  children,
  className,
  ...rest
}: ModalProps) => (
  <Dialog open={!!isOpen} onOpenChange={(o) => !o && onClose?.()}>
    <DialogContent
      className={cn(modalSizeMap[variant as string] ?? "max-w-2xl", className)}
      {...rest}
    >
      {title ? (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
      ) : null}
      <div className="space-y-3">{children}</div>
      {actions && actions.length > 0 ? (
        <DialogFooter>{actions}</DialogFooter>
      ) : null}
    </DialogContent>
  </Dialog>
);

export const Form = ({
  className,
  children,
  onSubmit,
  isHorizontal: _isHorizontal,
  id,
  ...rest
}: React.FormHTMLAttributes<HTMLFormElement> & { isHorizontal?: boolean }) => (
  <form
    id={id}
    onSubmit={onSubmit}
    className={cn("space-y-4", className)}
    {...rest}
  >
    {children}
  </form>
);

type FormGroupProps = {
  label?: ReactNode;
  fieldId?: string;
  labelIcon?: ReactNode;
  isRequired?: boolean;
  helperText?: ReactNode;
  helperTextInvalid?: ReactNode;
  validated?: "default" | "success" | "warning" | "error";
  children?: ReactNode;
  className?: string;
  hasNoPaddingTop?: boolean;
  role?: string;
};

export const FormGroup = ({
  label,
  fieldId,
  labelIcon,
  isRequired,
  helperText,
  helperTextInvalid,
  validated,
  children,
  className,
}: FormGroupProps) => (
  <div className={cn("space-y-1.5", className)}>
    {label ? (
      <div className="flex items-center gap-1.5">
        <SLabel htmlFor={fieldId}>
          {label}
          {isRequired ? <span className="ms-0.5 text-destructive">*</span> : null}
        </SLabel>
        {labelIcon}
      </div>
    ) : null}
    {children}
    {validated === "error" && helperTextInvalid ? (
      <p className="text-xs text-destructive">{helperTextInvalid}</p>
    ) : helperText ? (
      <p className="text-xs text-muted-foreground">{helperText}</p>
    ) : null}
  </div>
);

type TextInputProps = {
  id?: string;
  value?: string | number;
  validated?: "default" | "success" | "warning" | "error";
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  type?: string;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
  name?: string;
  autoComplete?: string;
  "data-testid"?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  iconVariant?: string;
};

export const TextInput = ({
  validated,
  onChange,
  isDisabled,
  isReadOnly,
  isRequired: _isRequired,
  iconVariant: _iconVariant,
  className,
  ...rest
}: TextInputProps) => {
  const { size: _size, ...inputRest } = rest as Record<string, unknown>;
  return (
    <Input
      disabled={isDisabled}
      readOnly={isReadOnly}
      aria-invalid={validated === "error"}
      onChange={(e) => onChange?.(e.target.value, e)}
      className={className}
      {...(inputRest as Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">)}
    />
  );
};

type TextAreaProps = {
  id?: string;
  value?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validated?: "default" | "success" | "warning" | "error";
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  rows?: number;
  className?: string;
  name?: string;
  placeholder?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const TextArea = ({
  validated,
  onChange,
  isDisabled,
  isReadOnly,
  isRequired: _isRequired,
  className,
  ...rest
}: TextAreaProps) => (
  <Textarea
    disabled={isDisabled}
    readOnly={isReadOnly}
    aria-invalid={validated === "error"}
    onChange={(e) => onChange?.(e.target.value, e)}
    className={className}
    {...(rest as Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">)}
  />
);

type SwitchPfProps = {
  id?: string;
  label?: ReactNode;
  labelOff?: ReactNode;
  isChecked?: boolean;
  onChange?: (
    event: React.FormEvent<HTMLInputElement> | React.MouseEvent,
    checked: boolean,
  ) => void;
  isDisabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
  name?: string;
};

export const Switch = ({
  id,
  label,
  labelOff,
  isChecked,
  onChange,
  isDisabled,
  className,
  "aria-label": ariaLabel,
  "data-testid": testId,
}: SwitchPfProps) => (
  <label
    htmlFor={id}
    className={cn("inline-flex items-center gap-2", className)}
  >
    <SSwitch
      id={id}
      checked={!!isChecked}
      disabled={isDisabled}
      aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      data-testid={testId}
      onCheckedChange={(c) =>
        onChange?.({ target: { checked: c } } as unknown as React.FormEvent<HTMLInputElement>, c)
      }
    />
    {isChecked ? label : (labelOff ?? label)}
  </label>
);

type RadioProps = {
  id?: string;
  name?: string;
  label?: ReactNode;
  isChecked?: boolean;
  onChange?: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  value?: string;
  className?: string;
  "data-testid"?: string;
};

export const Radio = ({
  id,
  name,
  label,
  isChecked,
  onChange,
  isDisabled,
  value,
  className,
  ...rest
}: RadioProps) => (
  <label
    htmlFor={id}
    className={cn("inline-flex items-center gap-2 text-sm", className)}
  >
    <input
      id={id}
      name={name}
      type="radio"
      value={value}
      checked={!!isChecked}
      disabled={isDisabled}
      onChange={(e) => onChange?.(e.target.checked, e)}
      className="size-4"
      {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
    />
    {label}
  </label>
);

type SearchInputProps = {
  value?: string;
  onChange?: (
    event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => void;
  onSearch?: () => void;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
  "data-testid"?: string;
};

export const SearchInput = ({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder,
  className,
  ...rest
}: SearchInputProps) => {
  const { size: _size, ...inputRest } = rest as Record<string, unknown>;
  return (
  <div className={cn("relative w-full max-w-xs", className)}>
    <Input
      value={value ?? ""}
      onChange={(e) =>
        onChange?.(e as unknown as React.FormEvent<HTMLInputElement>, e.target.value)
      }
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      {...(inputRest as Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">)}
    />
    {value ? (
      <button
        type="button"
        aria-label="clear"
        onClick={onClear}
        className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <XIcon className="size-3.5" />
      </button>
    ) : null}
  </div>
  );
};

type LabelProps = {
  color?: "blue" | "cyan" | "green" | "orange" | "purple" | "red" | "grey" | "gold";
  icon?: ReactNode;
  variant?: "filled" | "outline";
  className?: string;
  children?: ReactNode;
  isCompact?: boolean;
  onClose?: (e: React.MouseEvent) => void;
};

export const Label = ({
  color,
  icon,
  variant: _variant,
  className,
  children,
  onClose,
}: LabelProps) => (
  <SBadgePrimitive
    variant={
      color === "red"
        ? "destructive"
        : color === "blue" || color === "cyan"
          ? "default"
          : "secondary"
    }
    className={className}
  >
    {icon}
    {children}
    {onClose ? (
      <button
        type="button"
        onClick={onClose}
        aria-label="close"
        className="ms-1 rounded hover:bg-foreground/10"
      >
        <XIcon className="size-3" />
      </button>
    ) : null}
  </SBadgePrimitive>
);

type ChipProps = {
  isReadOnly?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  textMaxWidth?: string;
};

export const Chip = ({
  isReadOnly,
  onClick,
  children,
  className,
}: ChipProps) => (
  <SBadgePrimitive
    variant="secondary"
    className={cn("gap-1 pe-1", className)}
  >
    {children}
    {!isReadOnly && onClick ? (
      <button
        type="button"
        onClick={onClick}
        aria-label="remove"
        className="rounded hover:bg-foreground/10"
      >
        <XIcon className="size-3" />
      </button>
    ) : null}
  </SBadgePrimitive>
);

type ChipGroupProps = {
  categoryName?: ReactNode;
  numChips?: number;
  children?: ReactNode;
  className?: string;
  collapsedText?: string;
  expandedText?: string;
};

export const ChipGroup = ({
  categoryName,
  children,
  className,
}: ChipGroupProps) => (
  <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
    {categoryName ? (
      <span className="text-xs text-muted-foreground">{categoryName}</span>
    ) : null}
    {children}
  </div>
);

type TitleProps = {
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
};

const titleSizeMap: Record<string, string> = {
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
  "2xl": "text-xl",
  "3xl": "text-2xl",
  "4xl": "text-3xl",
};

export const Title = ({
  headingLevel = "h2",
  size = "xl",
  className,
  children,
  id,
  "data-testid": testId,
}: TitleProps) => {
  const H = headingLevel as unknown as keyof React.JSX.IntrinsicElements;
  return (
    <H
      id={id}
      data-testid={testId}
      className={cn("font-semibold text-foreground", titleSizeMap[size], className)}
    >
      {children}
    </H>
  );
};

export const Page = ({
  header,
  sidebar,
  children,
  className,
  isManagedSidebar: _isManagedSidebar,
}: {
  header?: ReactNode;
  sidebar?: ReactNode;
  children?: ReactNode;
  className?: string;
  isManagedSidebar?: boolean;
}) => (
  <div className={cn("flex h-screen flex-col bg-background", className)}>
    {header}
    <div className="flex flex-1 overflow-hidden">
      {sidebar}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export const PageSection = ({
  variant: _variant,
  className,
  children,
  padding: _padding,
  isFilled: _isFilled,
  ...rest
}: {
  variant?: "default" | "light" | "dark";
  padding?: { default?: "padding" | "noPadding" };
  isFilled?: boolean;
  className?: string;
  children?: ReactNode;
  id?: string;
}) => (
  <section className={cn("px-6 py-4", className)} {...rest}>
    {children}
  </section>
);

export const Banner = ({
  variant: _variant,
  screenReaderText: _sr,
  isSticky: _isSticky,
  className,
  children,
}: {
  variant?: "default" | "info" | "warning" | "danger" | "success";
  screenReaderText?: string;
  isSticky?: boolean;
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      "w-full border-b border-border bg-muted/50 px-4 py-2 text-center text-sm",
      className,
    )}
  >
    {children}
  </div>
);

export const ToolbarItem = ({
  children,
  className,
  variant: _variant,
  align: _align,
  alignSelf: _alignSelf,
  ...rest
}: {
  variant?: string;
  align?: Record<string, string>;
  alignSelf?: Record<string, string>;
  className?: string;
  children?: ReactNode;
}) => (
  <div className={cn("flex items-center", className)} {...rest}>
    {children}
  </div>
);

export const Flex = ({
  children,
  className,
  direction: _direction,
  justifyContent: _justifyContent,
  alignItems: _alignItems,
  spaceItems: _spaceItems,
  ...rest
}: {
  direction?: Record<string, string>;
  justifyContent?: Record<string, string>;
  alignItems?: Record<string, string>;
  spaceItems?: Record<string, string>;
  className?: string;
  children?: ReactNode;
}) => (
  <div className={cn("flex gap-2", className)} {...rest}>
    {children}
  </div>
);

export const FlexItem = ({
  children,
  className,
  ...rest
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div className={cn("flex-initial", className)} {...rest}>
    {children}
  </div>
);

export const Divider = ({
  className,
  orientation,
}: {
  className?: string;
  orientation?: { default?: "horizontal" | "vertical" };
}) => (
  <Separator
    orientation={orientation?.default ?? "horizontal"}
    className={className}
  />
);

export const Icon = ({
  size: _size,
  className,
  children,
  status,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: ReactNode;
  status?: "success" | "danger" | "warning" | "info";
}) => (
  <span
    className={cn(
      "inline-flex items-center justify-center",
      status === "danger" && "text-destructive",
      status === "warning" && "text-amber-500",
      status === "success" && "text-emerald-500",
      status === "info" && "text-blue-500",
      className,
    )}
  >
    {children}
  </span>
);

export const ActionGroup = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-2 pt-2", className)}>{children}</div>
);

type ExpandableSectionProps = {
  toggleText?: ReactNode;
  toggleTextExpanded?: ReactNode;
  toggleTextCollapsed?: ReactNode;
  isExpanded?: boolean;
  onToggle?: (event: React.MouseEvent, isExpanded: boolean) => void;
  children?: ReactNode;
  className?: string;
  "data-testid"?: string;
};

export const ExpandableSection = ({
  toggleText,
  toggleTextExpanded,
  toggleTextCollapsed,
  isExpanded,
  onToggle,
  children,
  className,
  "data-testid": testId,
}: ExpandableSectionProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isExpanded ?? internalOpen;
  const text = open
    ? (toggleTextExpanded ?? toggleText)
    : (toggleTextCollapsed ?? toggleText);
  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => {
        setInternalOpen(o);
        onToggle?.({} as React.MouseEvent, o);
      }}
      className={className}
      data-testid={testId}
    >
      <CollapsibleTrigger className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        {text}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export const Tooltip = ({
  content,
  children,
  position: _position,
  className,
}: {
  content?: ReactNode;
  children?: ReactNode;
  position?: string;
  className?: string;
}) => (
  <STooltip>
    <TooltipTrigger asChild>
      <span className={className}>{children}</span>
    </TooltipTrigger>
    <TooltipContent>{content}</TooltipContent>
  </STooltip>
);

type TabCtx = {
  activeKey: string | number;
  setActive: (k: string | number) => void;
  onSelect?: (e: React.MouseEvent, key: string | number) => void;
};
const TabsContext = createContext<TabCtx | null>(null);

type TabsProps = {
  activeKey?: string | number;
  defaultActiveKey?: string | number;
  onSelect?: (event: React.MouseEvent, key: string | number) => void;
  isBox?: boolean;
  children?: ReactNode;
  className?: string;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const Tabs = ({
  activeKey,
  defaultActiveKey,
  onSelect,
  children,
  className,
}: TabsProps) => {
  const [internal, setInternal] = useState<string | number>(
    activeKey ?? defaultActiveKey ?? 0,
  );
  const current = activeKey ?? internal;
  const setActive = (k: string | number) => {
    if (activeKey === undefined) setInternal(k);
  };
  return (
    <TabsContext.Provider value={{ activeKey: current, setActive, onSelect }}>
      <div className={cn("space-y-4", className)}>
        <div
          role="tablist"
          className="flex gap-2 border-b border-border"
          data-slot="tabs-list"
        >
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

type TabProps = {
  eventKey: string | number;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  tabContentId?: string;
  "data-testid"?: string;
  isHidden?: boolean;
  "aria-label"?: string;
};

export const Tab = ({
  eventKey,
  title,
  children,
  isHidden,
}: TabProps) => {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.activeKey === eventKey;
  if (isHidden) return null;
  return (
    <>
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={(e) => {
          ctx.setActive(eventKey);
          ctx.onSelect?.(e, eventKey);
        }}
        className={cn(
          "border-b-2 px-3 py-2 text-sm font-medium",
          isActive
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {title}
      </button>
      {isActive ? (
        <div role="tabpanel" className="mt-4 w-full basis-full">
          {children}
        </div>
      ) : null}
    </>
  );
};

export const TabTitleText = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => <span className={className}>{children}</span>;

export const SelectOption = ({
  value: _value,
  children,
  isSelected: _isSelected,
  isDisabled: _isDisabled,
  ...rest
}: {
  value?: unknown;
  children?: ReactNode;
  isSelected?: boolean;
  isDisabled?: boolean;
  [k: string]: unknown;
}) => <Fragment {...(rest as object)}>{children}</Fragment>;

export const DropdownItem = ({
  children,
  onClick,
  isDisabled,
  className,
  ...rest
}: {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  isDisabled?: boolean;
  className?: string;
  [k: string]: unknown;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isDisabled}
    className={cn(
      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50",
      className,
    )}
    {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
  >
    {children}
  </button>
);

export const DataListDragButton = ({
  "aria-label": ariaLabel,
  className,
}: {
  "aria-label"?: string;
  className?: string;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    className={cn("cursor-grab rounded p-1 text-muted-foreground", className)}
  >
    ⋮⋮
  </button>
);

type DescriptionListProps = {
  children?: ReactNode;
  className?: string;
  isHorizontal?: boolean;
  columnModifier?: Record<string, string>;
  horizontalTermWidthModifier?: Record<string, string>;
};

export const DescriptionList = ({
  children,
  className,
  isHorizontal,
}: DescriptionListProps) => (
  <dl
    className={cn(
      "grid gap-x-4 gap-y-2 text-sm",
      isHorizontal
        ? "grid-cols-1 sm:grid-cols-[max-content_1fr]"
        : "grid-cols-1",
      className,
    )}
  >
    {children}
  </dl>
);

export const DescriptionListGroup = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <div className={cn("contents", className)}>{children}</div>
);

export const DescriptionListTerm = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <dt className={cn("font-medium text-foreground/80", className)}>{children}</dt>
);

export const DescriptionListDescription = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <dd className={cn("text-muted-foreground", className)}>{children}</dd>
);

type FileUploadProps = {
  id?: string;
  value?: string | File | null;
  filename?: string;
  onFileInputChange?: (event: unknown, file: File) => void;
  onDataChange?: (event: unknown, data: string) => void;
  onTextChange?: (event: unknown, text: string) => void;
  onClearClick?: () => void;
  type?: "text" | "dataURL";
  hideDefaultPreview?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  allowEditingUploadedText?: boolean;
  browseButtonText?: string;
  clearButtonText?: string;
  "data-testid"?: string;
};

export const FileUpload = ({
  id,
  value,
  filename,
  onFileInputChange,
  onDataChange,
  onTextChange,
  onClearClick,
  isDisabled,
  className,
  browseButtonText,
  clearButtonText,
}: FileUploadProps) => {
  const inputId = useId();
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <input
          id={id ?? inputId}
          type="file"
          disabled={isDisabled}
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onFileInputChange?.(e, file);
            const text = await file.text();
            onTextChange?.(e, text);
            onDataChange?.(e, text);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          isDisabled={isDisabled}
          onClick={() => document.getElementById(id ?? inputId)?.click()}
        >
          {browseButtonText ?? "Upload"}
        </Button>
        {filename ? (
          <span className="text-sm text-muted-foreground">{filename}</span>
        ) : null}
        {value ? (
          <Button type="button" variant="link" onClick={onClearClick}>
            {clearButtonText ?? "Clear"}
          </Button>
        ) : null}
      </div>
      {typeof value === "string" && value ? (
        <Textarea
          value={value}
          readOnly={isDisabled}
          onChange={(e) => {
            onTextChange?.(e, e.target.value);
            onDataChange?.(e, e.target.value);
          }}
          rows={6}
        />
      ) : null}
    </div>
  );
};

export { SLabel as PfLabelPrimitive };

/* ============================================================
 * Comprehensive PatternFly compatibility stubs
 * Minimal shadcn-styled implementations for everything the
 * admin codebase imports. Many are best-effort visual approximations.
 * ============================================================ */

type AnyProps = { children?: ReactNode; className?: string; [k: string]: unknown };

const passThrough = (
  Tag: keyof React.JSX.IntrinsicElements = "div",
  baseClass = "",
) => {
  const C = ({ children, className, ...rest }: AnyProps) => {
    const TagAny = Tag as unknown as React.ElementType;
    return (
      <TagAny className={cn(baseClass, className)} {...(rest as object)}>
        {children}
      </TagAny>
    );
  };
  return C;
};

/* -------- generic structural primitives ---------- */
export const Stack = passThrough("div", "flex flex-col gap-2");
export const StackItem = passThrough("div");
export const Split = passThrough("div", "flex gap-2");
export const SplitItem = passThrough("div");
export const Level = passThrough("div", "flex items-center justify-between gap-2");
export const LevelItem = passThrough("div");
export const Grid = passThrough("div", "grid grid-cols-12 gap-3");
export const GridItem = ({
  children,
  className,
  span,
  ...rest
}: AnyProps & { span?: number; sm?: number; md?: number; lg?: number; xl?: number; rowSpan?: number }) => (
  <div
    className={cn(span ? `col-span-${span}` : "col-span-12", className)}
    {...(rest as object)}
  >
    {children}
  </div>
);
export const Gallery = passThrough("div", "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3");
export const GalleryItem = passThrough("div");
export const Panel = passThrough("section", "rounded-md border border-border");
export const PanelHeader = passThrough("header", "border-b border-border bg-muted/30 px-4 py-2");
export const PanelMainBody = passThrough("div", "p-4");

/* -------- toolbars ---------- */
export const Toolbar = passThrough("div", "flex flex-wrap items-center gap-2");
export const ToolbarContent = passThrough("div", "flex flex-wrap items-center gap-2 w-full");
export const ToolbarGroup = passThrough("div", "flex items-center gap-2");

/* -------- dropdown ---------- */
export const Dropdown = ({
  children,
  isOpen,
  toggle,
  onOpenChange: _onOpen,
  popperProps: _pp,
  ...rest
}: AnyProps & {
  isOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  toggle?: ReactNode | ((ref: React.Ref<HTMLButtonElement>) => ReactNode);
  popperProps?: unknown;
}) => {
  const renderedToggle =
    typeof toggle === "function" ? toggle({ current: null } as React.Ref<HTMLButtonElement>) : toggle;
  return (
    <div className="relative inline-block" {...(rest as object)}>
      {renderedToggle}
      {isOpen ? (
        <div className="absolute z-50 mt-1 min-w-[10rem] rounded-md border border-border bg-popover p-1 shadow-md">
          {children}
        </div>
      ) : null}
    </div>
  );
};
export const DropdownGroup = passThrough("div");
export const DropdownList = passThrough("div", "flex flex-col");

/* -------- menu toggle ---------- */
export const MenuToggle = ({
  children,
  className,
  variant: _variant,
  isExpanded,
  onClick,
  isDisabled,
  ...rest
}: AnyProps & {
  variant?: string;
  isExpanded?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isDisabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isDisabled}
    aria-expanded={isExpanded}
    className={cn(
      "inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-sm hover:bg-muted disabled:opacity-50",
      className,
    )}
    {...(rest as object)}
  >
    {children}
  </button>
);
export type MenuToggleElement = HTMLButtonElement;

/* -------- nav ---------- */
export const Nav = passThrough("nav");
export const NavGroup = ({
  children,
  className,
  title,
  ...rest
}: AnyProps & { title?: ReactNode }) => (
  <div className={cn("space-y-1 py-2", className)} {...(rest as object)}>
    {title ? (
      <div className="px-3 text-xs font-medium uppercase text-muted-foreground">
        {title}
      </div>
    ) : null}
    {children}
  </div>
);
export const PageSidebar = passThrough("aside", "w-60 border-r border-border bg-card");
export const PageSidebarBody = passThrough("div", "px-2 py-3");

/* -------- popover ---------- */
import {
  Popover as SPopover,
  PopoverContent as SPopoverContent,
  PopoverTrigger as SPopoverTrigger,
} from "@albatroaz/ui/components/popover";

export const Popover = ({
  children,
  bodyContent,
  headerContent,
  triggerRef: _triggerRef,
  isVisible,
  onShown: _os,
  onHidden: _oh,
  position: _pos,
  ...rest
}: AnyProps & {
  bodyContent?: ReactNode | (() => ReactNode);
  headerContent?: ReactNode | (() => ReactNode);
  triggerRef?: unknown;
  isVisible?: boolean;
  onShown?: () => void;
  onHidden?: () => void;
  position?: string;
}) => (
  <SPopover open={isVisible}>
    <SPopoverTrigger asChild>
      <span {...(rest as object)}>{children}</span>
    </SPopoverTrigger>
    <SPopoverContent>
      {typeof headerContent === "function" ? headerContent() : headerContent}
      {typeof bodyContent === "function" ? bodyContent() : bodyContent}
    </SPopoverContent>
  </SPopover>
);

/* -------- select ---------- */
import {
  Select as SSelect,
  SelectContent as SSelectContent,
  SelectItem as SSelectItem,
  SelectTrigger as SSelectTrigger,
  SelectValue as SSelectValue,
} from "@albatroaz/ui/components/select";

export const Select = ({
  children,
  isOpen: _isOpen,
  onToggle: _onToggle,
  onSelect,
  selected,
  toggle,
  placeholderText,
  isDisabled,
  shouldFocusToggleOnSelect: _sf,
  ...rest
}: AnyProps & {
  isOpen?: boolean;
  onToggle?: (e: unknown, isOpen: boolean) => void;
  onSelect?: (e: unknown, value: unknown) => void;
  selected?: unknown;
  toggle?: ReactNode | ((ref: React.Ref<HTMLButtonElement>) => ReactNode);
  placeholderText?: ReactNode;
  isDisabled?: boolean;
  shouldFocusToggleOnSelect?: boolean;
}) => (
  <SSelect
    value={typeof selected === "string" ? selected : undefined}
    onValueChange={(v) => onSelect?.({}, v)}
    disabled={isDisabled}
    {...(rest as object)}
  >
    <SSelectTrigger>
      <SSelectValue placeholder={placeholderText as string} />
    </SSelectTrigger>
    <SSelectContent>{children}</SSelectContent>
  </SSelect>
);
export const SelectGroup = passThrough("div");
export const SelectList = passThrough("div");
export type SelectProps = AnyProps;

/* -------- spinner ---------- */
import { Spinner as SSpinner } from "@albatroaz/ui/components/spinner";
export const Spinner = ({
  className,
  size: _size,
  diameter: _d,
}: {
  className?: string;
  size?: string;
  diameter?: string;
}) => <SSpinner className={cn("size-4", className)} />;

/* -------- text ---------- */
export const Text = ({
  children,
  className,
  component,
  ...rest
}: AnyProps & {
  component?: keyof React.JSX.IntrinsicElements;
}) => {
  const Tag = (component ?? "p") as React.ElementType;
  return (
    <Tag className={cn("text-sm text-foreground", className)} {...(rest as object)}>
      {children}
    </Tag>
  );
};
export const TextContent = passThrough("div", "space-y-2 text-sm");
export const TextList = passThrough("ul", "list-disc ps-5 space-y-1 text-sm");
export const TextListItem = passThrough("li");
export enum TextListItemVariants { dt = "dt", dd = "dd", li = "li" }
export enum TextListVariants { ul = "ul", ol = "ol", dl = "dl" }
export enum TextVariants { p = "p", h1 = "h1", h2 = "h2", h3 = "h3", h4 = "h4", h5 = "h5", h6 = "h6", a = "a", small = "small", blockquote = "blockquote", pre = "pre" }

/* -------- title sizes ---------- */
export enum TitleSizes {
  md = "md",
  lg = "lg",
  xl = "xl",
  "2xl" = "2xl",
  "3xl" = "3xl",
  "4xl" = "4xl",
}

export enum PageSectionVariants {
  default = "default",
  light = "light",
  dark = "dark",
  darker = "darker",
}

/* -------- breadcrumb ---------- */
export const Breadcrumb = passThrough("nav", "flex items-center gap-1 text-sm text-muted-foreground");
export const BreadcrumbItem = ({
  children,
  className,
  isActive,
  to,
  ...rest
}: AnyProps & { isActive?: boolean; to?: string }) => (
  <span
    className={cn(
      "flex items-center gap-1 before:content-['/'] before:px-1 first:before:hidden",
      isActive && "text-foreground font-medium",
      className,
    )}
    {...(rest as object)}
  >
    {to ? <a href={to}>{children}</a> : children}
  </span>
);

/* -------- card ---------- */
export const Card = ({ children, className, isClickable: _ic, isSelected: _is, isExpanded: _ie, ...rest }: AnyProps & { isClickable?: boolean; isSelected?: boolean; isExpanded?: boolean }) => (
  <section className={cn("rounded-md border border-border bg-card", className)} {...(rest as object)}>
    {children}
  </section>
);
export const CardHeader = passThrough("header", "px-4 pt-3 pb-1");
export const CardTitle = passThrough("h3", "text-base font-semibold");
export const CardBody = passThrough("div", "px-4 py-2 text-sm");
export const CardFooter = passThrough("footer", "px-4 pb-3 pt-1");
export type CardProps = AnyProps;

/* -------- alert extras ---------- */
export const AlertActionLink = ({
  children,
  onClick,
  className,
}: AnyProps & { onClick?: (e: React.MouseEvent) => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("text-sm font-medium text-primary hover:underline", className)}
  >
    {children}
  </button>
);
export const AlertActionCloseButton = ({
  onClose,
  className,
}: { onClose?: () => void; className?: string }) => (
  <button
    type="button"
    onClick={onClose}
    aria-label="close"
    className={cn("rounded p-1 text-muted-foreground hover:bg-foreground/10", className)}
  >
    <XIcon className="size-3.5" />
  </button>
);

/* -------- form helper ---------- */
export const FormHelperText = passThrough("div", "text-xs text-muted-foreground");
export const HelperText = passThrough("div", "text-xs");
export const HelperTextItem = ({
  children,
  className,
  variant,
  ...rest
}: AnyProps & { variant?: "default" | "indeterminate" | "warning" | "success" | "error" }) => (
  <span
    className={cn(
      variant === "error" && "text-destructive",
      variant === "warning" && "text-amber-600",
      variant === "success" && "text-emerald-600",
      className,
    )}
    {...(rest as object)}
  >
    {children}
  </span>
);
export type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

/* -------- input groups ---------- */
export const InputGroup = passThrough("div", "flex");
export const InputGroupItem = passThrough("div", "flex-1");
export const TextInputGroup = passThrough("div", "relative flex w-full items-center");
export const TextInputGroupMain = passThrough("div", "flex-1");
export const TextInputGroupUtilities = passThrough("div", "flex items-center gap-1");
export type ActionGroupProps = AnyProps;

/* -------- checkbox ---------- */
import { Checkbox as SCheckbox2 } from "@albatroaz/ui/components/checkbox";
export const Checkbox = ({
  id,
  isChecked,
  onChange,
  isDisabled,
  label,
  className,
  ...rest
}: AnyProps & {
  id?: string;
  isChecked?: boolean;
  onChange?: (event: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
  isDisabled?: boolean;
  label?: ReactNode;
}) => (
  <label htmlFor={id} className={cn("inline-flex items-center gap-2 text-sm", className)}>
    <SCheckbox2
      id={id}
      checked={!!isChecked}
      disabled={isDisabled}
      onCheckedChange={(c) =>
        onChange?.({} as React.FormEvent<HTMLInputElement>, !!c)
      }
      {...(rest as object)}
    />
    {label}
  </label>
);

/* -------- badge ---------- */
import { Badge as SBadge } from "@albatroaz/ui/components/badge";
export const Badge = ({ children, className, isRead, ...rest }: AnyProps & { isRead?: boolean }) => (
  <SBadge variant="secondary" className={className} {...(rest as object)}>{children}</SBadge>
);

/* -------- list ---------- */
export const List = ({ children, className, variant: _v, isPlain: _ip, ...rest }: AnyProps & { variant?: string; isPlain?: boolean }) => (
  <ul className={cn("list-disc ps-5 space-y-1 text-sm", className)} {...(rest as object)}>{children}</ul>
);
export const ListItem = passThrough("li");
export enum ListVariant { inline = "inline" }

/* -------- label group ---------- */
export const LabelGroup = passThrough("div", "flex flex-wrap items-center gap-1.5");

/* -------- toggle group ---------- */
export const ToggleGroup = passThrough("div", "inline-flex items-center rounded-md border border-input p-0.5");
export const ToggleGroupItem = ({
  children,
  isSelected,
  onChange,
  className,
  ...rest
}: AnyProps & {
  isSelected?: boolean;
  onChange?: (event: React.MouseEvent | React.KeyboardEvent, selected: boolean) => void;
}) => (
  <button
    type="button"
    onClick={(e) => onChange?.(e, !isSelected)}
    aria-pressed={isSelected}
    className={cn(
      "rounded px-2 py-1 text-xs",
      isSelected ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50",
      className,
    )}
    {...(rest as object)}
  >
    {children}
  </button>
);

/* -------- tabs additions ---------- */
export const TabContent = passThrough("div");
export const TabsComponent = passThrough("div");

/* -------- empty state ---------- */
export const EmptyState = ({ children, className, variant: _v, ...rest }: AnyProps & { variant?: string }) => (
  <div className={cn("flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 px-6 py-12 text-center", className)} {...(rest as object)}>
    {children}
  </div>
);
export const EmptyStateBody = passThrough("p", "text-sm text-muted-foreground");
export const EmptyStateActions = passThrough("div", "flex flex-wrap items-center justify-center gap-2 pt-2");
export const EmptyStateFooter = passThrough("footer", "pt-2");
export const EmptyStateHeader = ({
  children,
  className,
  titleText,
  headingLevel = "h2",
  icon,
  ...rest
}: AnyProps & {
  titleText?: ReactNode;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  icon?: ReactNode;
}) => {
  const H = headingLevel as React.ElementType;
  return (
    <div className={cn("space-y-2 text-center", className)} {...(rest as object)}>
      {icon}
      {titleText ? <H className="text-base font-semibold text-foreground">{titleText}</H> : null}
      {children}
    </div>
  );
};
export const EmptyStateIcon = ({ icon, className, ...rest }: { icon: React.ComponentType<unknown>; className?: string; [k: string]: unknown }) => {
  const I = icon as React.ElementType;
  return <I className={cn("size-10 text-muted-foreground", className)} {...(rest as object)} />;
};

/* -------- drawer ---------- */
export const Drawer = passThrough("div", "flex h-full");
export const DrawerContent = passThrough("div", "flex-1");
export const DrawerContentBody = passThrough("div", "p-4");
export const DrawerHead = passThrough("div", "border-b border-border p-3");
export const DrawerPanelContent = passThrough("aside", "w-80 border-l border-border bg-card");

/* -------- tree view ---------- */
export type TreeViewDataItem = {
  name: ReactNode;
  id?: string;
  icon?: ReactNode;
  expandedIcon?: ReactNode;
  children?: TreeViewDataItem[];
  defaultExpanded?: boolean;
  hasBadge?: boolean;
  customBadgeContent?: ReactNode;
};

const TreeNode = ({
  item,
  level,
  onSelect,
  activeItems,
}: {
  item: TreeViewDataItem;
  level: number;
  onSelect?: (e: React.MouseEvent, item: TreeViewDataItem) => void;
  activeItems?: TreeViewDataItem[];
}) => {
  const [open, setOpen] = useState(!!item.defaultExpanded);
  const isActive = activeItems?.some((a) => a.id === item.id);
  return (
    <li>
      <div
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm hover:bg-muted",
          isActive && "bg-muted",
        )}
        style={{ paddingInlineStart: `${level * 12 + 8}px` }}
        onClick={(e) => {
          if (item.children) setOpen((v) => !v);
          onSelect?.(e, item);
        }}
      >
        {item.children ? (
          <span className="size-3">{open ? "▾" : "▸"}</span>
        ) : (
          <span className="size-3" />
        )}
        {item.icon}
        <span className="flex-1">{item.name}</span>
        {item.customBadgeContent}
      </div>
      {item.children && open ? (
        <ul>
          {item.children.map((c, i) => (
            <TreeNode
              key={c.id ?? i}
              item={c}
              level={level + 1}
              onSelect={onSelect}
              activeItems={activeItems}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export const TreeView = ({
  data,
  onSelect,
  activeItems,
  className,
  ..._rest
}: {
  data: TreeViewDataItem[];
  onSelect?: (e: React.MouseEvent, item: TreeViewDataItem) => void;
  activeItems?: TreeViewDataItem[];
  className?: string;
  [k: string]: unknown;
}) => (
  <ul className={cn("space-y-0.5", className)}>
    {data.map((d, i) => (
      <TreeNode
        key={d.id ?? i}
        item={d}
        level={0}
        onSelect={onSelect}
        activeItems={activeItems}
      />
    ))}
  </ul>
);

/* -------- data list (keep flat shadcn list) ---------- */
export const DataList = passThrough("ul", "divide-y divide-border rounded-md border border-border");
export const DataListItem = ({ children, className, isExpanded: _ie, ...rest }: AnyProps & { isExpanded?: boolean }) => (
  <li className={cn("p-3", className)} {...(rest as object)}>{children}</li>
);
export const DataListItemRow = passThrough("div", "flex items-center gap-3");
export const DataListItemCells = ({
  dataListCells,
  className,
}: {
  dataListCells: ReactNode[];
  className?: string;
}) => (
  <div className={cn("flex flex-1 items-center gap-3", className)}>
    {dataListCells}
  </div>
);
export const DataListCell = passThrough("div", "flex-1 text-sm");
export const DataListAction = ({
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": _alb,
  id,
}: AnyProps & { "aria-label"?: string; "aria-labelledby"?: string; id?: string }) => (
  <div id={id} aria-label={ariaLabel} className={cn("flex items-center gap-1", className)}>{children}</div>
);
export const DataListCheck = ({
  isChecked,
  onChange,
  className,
  "aria-labelledby": _ariaLabelledby,
}: {
  isChecked?: boolean;
  onChange?: (e: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
  className?: string;
  "aria-labelledby"?: string;
}) => (
  <input
    type="checkbox"
    checked={!!isChecked}
    onChange={(e) => onChange?.(e, e.target.checked)}
    className={cn("size-4 rounded border-input", className)}
  />
);
export const DataListControl = passThrough("div", "flex items-center");

/* -------- brand / clipboard / codeblock / drag-drop / wizard - minimal ---- */
export const Brand = ({
  src,
  alt,
  className,
  ...rest
}: { src?: string; alt?: string; className?: string; [k: string]: unknown }) => (
  <img src={src} alt={alt} className={cn("h-7", className)} {...(rest as object)} />
);

export const ClipboardCopy = ({
  children,
  className,
  isReadOnly,
  hoverTip,
  clickTip,
  variant: _v,
  ...rest
}: AnyProps & { isReadOnly?: boolean; hoverTip?: string; clickTip?: string; variant?: string }) => {
  const text = typeof children === "string" ? children : "";
  return (
    <div className={cn("flex items-center gap-2 rounded border border-input bg-muted/30 px-2 py-1 font-mono text-xs", className)} {...(rest as object)}>
      <span className="flex-1 truncate">{text}</span>
      <button
        type="button"
        title={hoverTip ?? "copy"}
        onClick={() => navigator.clipboard?.writeText(text)}
        className="text-muted-foreground hover:text-foreground"
      >
        ⧉
      </button>
    </div>
  );
};

export const ClipboardCopyButton = ({
  children,
  onClick,
  className,
  exitDelay: _ed,
  variant: _v,
  ...rest
}: AnyProps & { onClick?: (e: React.MouseEvent) => void; exitDelay?: number; variant?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground", className)}
    {...(rest as object)}
  >
    {children}
  </button>
);
export type ClipboardCopyButtonProps = ComponentProps<typeof ClipboardCopyButton>;

export const CodeBlock = ({ children, className, actions, ...rest }: AnyProps & { actions?: ReactNode }) => (
  <div className={cn("relative rounded-md border border-border bg-muted/30 p-3 text-xs", className)} {...(rest as object)}>
    {actions ? <div className="absolute end-2 top-2 flex gap-1">{actions}</div> : null}
    <pre className="overflow-x-auto">{children}</pre>
  </div>
);
export const CodeBlockAction = passThrough("div", "inline-flex items-center");

export type DragDropProps = AnyProps;
export const DragDrop = ({ children }: AnyProps) => <>{children}</>;
export const Draggable = ({ children, className, ...rest }: AnyProps) => (
  <div className={cn("cursor-grab", className)} {...(rest as object)}>{children}</div>
);
export const Droppable = ({ children, className, ...rest }: AnyProps) => (
  <div className={cn("space-y-1", className)} {...(rest as object)}>{children}</div>
);
export type DraggableItemPosition = { index: number; droppableId: string };
export type DropEvent = unknown;
export type DropdownProps = AnyProps;

/* -------- date / time / number ---------- */
export const DatePicker = ({
  value,
  onChange,
  isDisabled,
  className,
  placeholder,
  ...rest
}: {
  value?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>, value: string) => void;
  isDisabled?: boolean;
  className?: string;
  placeholder?: string;
  [k: string]: unknown;
}) => (
  <Input
    type="date"
    disabled={isDisabled}
    value={value ?? ""}
    placeholder={placeholder}
    className={className}
    onChange={(e) =>
      onChange?.(e as unknown as React.FormEvent<HTMLInputElement>, e.target.value)
    }
    {...(rest as object)}
  />
);
export const TimePicker = ({
  time,
  onChange,
  isDisabled,
  className,
}: {
  time?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>, time: string) => void;
  isDisabled?: boolean;
  className?: string;
}) => (
  <Input
    type="time"
    disabled={isDisabled}
    value={time ?? ""}
    className={className}
    onChange={(e) => onChange?.(e as unknown as React.FormEvent<HTMLInputElement>, e.target.value)}
  />
);
export const NumberInput = ({
  value,
  onMinus,
  onPlus,
  onChange,
  min,
  max,
  isDisabled,
  className,
  inputName: _in,
  inputAriaLabel,
  minusBtnAriaLabel,
  plusBtnAriaLabel,
  ...rest
}: {
  value?: number | string;
  onMinus?: () => void;
  onPlus?: () => void;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  isDisabled?: boolean;
  className?: string;
  inputName?: string;
  inputAriaLabel?: string;
  minusBtnAriaLabel?: string;
  plusBtnAriaLabel?: string;
  [k: string]: unknown;
}) => (
  <div className={cn("inline-flex items-center", className)}>
    <button
      type="button"
      onClick={onMinus}
      disabled={isDisabled}
      aria-label={minusBtnAriaLabel ?? "decrement"}
      className="rounded-l-md border border-input px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
    >
      −
    </button>
    <Input
      type="number"
      value={value ?? ""}
      min={min}
      max={max}
      disabled={isDisabled}
      onChange={onChange}
      aria-label={inputAriaLabel}
      className="rounded-none border-x-0 text-center"
      {...(rest as object)}
    />
    <button
      type="button"
      onClick={onPlus}
      disabled={isDisabled}
      aria-label={plusBtnAriaLabel ?? "increment"}
      className="rounded-r-md border border-input px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
    >
      +
    </button>
  </div>
);

/* -------- wizard ---------- */
const WizardCtx = createContext<{
  activeStep: number;
  steps: string[];
  goTo: (i: number) => void;
} | null>(null);

export const useWizardContext = () => {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error("Wizard context missing");
  return ctx;
};

export const Wizard = ({
  children,
  onSave,
  onClose,
  className,
}: AnyProps & {
  onSave?: () => void | Promise<void>;
  onClose?: () => void;
}) => {
  const stepArray = Array.isArray(children) ? (children as ReactNode[]) : [children];
  const [active, setActive] = useState(0);
  const stepNames = stepArray.map((c, i) => {
    const child = c as { props?: { name?: string } };
    return child?.props?.name ?? `Step ${i + 1}`;
  });
  return (
    <WizardCtx.Provider
      value={{
        activeStep: active,
        steps: stepNames,
        goTo: (i) => setActive(Math.max(0, Math.min(i, stepArray.length - 1))),
      }}
    >
      <div className={cn("flex flex-col gap-4", className)}>
        <ol className="flex gap-2 text-xs">
          {stepNames.map((name, i) => (
            <li
              key={name}
              className={cn(
                "rounded px-2 py-1",
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}. {name}
            </li>
          ))}
        </ol>
        <div>{stepArray[active]}</div>
        <WizardFooter
          onBack={active > 0 ? () => setActive((s) => s - 1) : undefined}
          onNext={
            active < stepArray.length - 1
              ? () => setActive((s) => s + 1)
              : undefined
          }
          onFinish={active === stepArray.length - 1 ? onSave : undefined}
          onCancel={onClose}
        />
      </div>
    </WizardCtx.Provider>
  );
};

export const WizardStep = ({
  children,
  name: _name,
  id: _id,
  ..._rest
}: AnyProps & { name?: string; id?: string }) => <>{children}</>;

export const WizardFooter = ({
  onBack,
  onNext,
  onFinish,
  onCancel,
}: {
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}) => (
  <div className="flex justify-end gap-2 border-t border-border pt-3">
    {onCancel ? (
      <Button variant="link" onClick={onCancel}>
        Cancel
      </Button>
    ) : null}
    {onBack ? (
      <Button variant="secondary" onClick={onBack}>
        Back
      </Button>
    ) : null}
    {onNext ? (
      <Button onClick={onNext}>Next</Button>
    ) : null}
    {onFinish ? (
      <Button onClick={onFinish}>Finish</Button>
    ) : null}
  </div>
);

export const WizardFooterWrapper = passThrough("div", "flex justify-end gap-2");

/* -------- file upload props (re-export) removed - already declared above ---------- */

/* -------- action list ---------- */
export const ActionList = passThrough("div", "flex flex-wrap items-center gap-2");
export const ActionListItem = passThrough("div");

/* -------- validated options ---------- */
export enum ValidatedOptions {
  default = "default",
  success = "success",
  warning = "warning",
  error = "error",
}

/* -------- capitalize utility ---------- */
export const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
