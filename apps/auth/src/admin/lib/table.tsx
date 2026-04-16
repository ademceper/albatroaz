import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@albatroaz/ui/lib/utils";

export type IRowData = {
  cells?: Array<string | { title?: ReactNode; props?: Record<string, unknown> }>;
  selected?: boolean;
  disableSelection?: boolean;
  disableActions?: boolean;
  [key: string]: unknown;
};

export type TableTextProps = {
  children?: ReactNode;
  className?: string;
  wrapModifier?: "truncate" | "breakWord" | "nowrap";
};

export const TableText = ({ children, className, wrapModifier }: TableTextProps) => (
  <span
    className={cn(
      "inline-block",
      wrapModifier === "truncate" && "max-w-full truncate",
      wrapModifier === "nowrap" && "whitespace-nowrap",
      wrapModifier === "breakWord" && "break-words",
      className,
    )}
  >
    {children}
  </span>
);

export const cellWidth = (n: number) => ({ width: `${n}%` });
export const wrappable = "wrappable";

export const Table = ({
  children,
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    >
      {children}
    </table>
  </div>
);

export const Thead = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn("border-b border-border bg-muted/40 [&_tr]:border-b-0", className)}
    {...props}
  >
    {children}
  </thead>
);

export const Tbody = ({
  children,
  className,
  isExpanded: _isExpanded,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & { isExpanded?: boolean }) => (
  <tbody
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  >
    {children}
  </tbody>
);

export const Tr = ({
  children,
  className,
  isExpanded: _isExpanded,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { isExpanded?: boolean }) => (
  <tr
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50",
      className,
    )}
    {...props}
  >
    {children}
  </tr>
);

type ThProps = ThHTMLAttributes<HTMLTableCellElement> & {
  "aria-hidden"?: boolean | "true" | "false";
  info?: { popover?: ReactNode };
  sort?: unknown;
};

export const Th = ({ children, className, info: _info, sort: _sort, ...props }: ThProps) => (
  <th
    className={cn(
      "h-10 px-3 text-left align-middle text-xs font-medium text-foreground/80",
      className,
    )}
    {...props}
  >
    {children}
  </th>
);

type TdProps = TdHTMLAttributes<HTMLTableCellElement> & {
  dataLabel?: string;
  isActionCell?: boolean;
  expand?: {
    isExpanded?: boolean;
    rowIndex?: number;
    onToggle?: () => void;
  };
  textCenter?: boolean;
  select?: {
    rowIndex?: number;
    onSelect?: (e: unknown, isSelected: boolean, rowIndex: number) => void;
    isSelected?: boolean;
  };
};

export const Td = ({
  children,
  className,
  dataLabel: _dataLabel,
  isActionCell,
  expand,
  textCenter,
  select,
  ...props
}: TdProps) => {
  if (select) {
    return (
      <td className={cn("h-10 px-3 align-middle", className)} {...props}>
        <input
          type="checkbox"
          checked={!!select.isSelected}
          onChange={(e) =>
            select.onSelect?.(e, e.target.checked, select.rowIndex ?? 0)
          }
          className="size-4 rounded border-input"
        />
      </td>
    );
  }
  if (expand) {
    return (
      <td className={cn("h-10 w-10 px-3 align-middle", className)} {...props}>
        <button
          type="button"
          onClick={expand.onToggle}
          aria-expanded={expand.isExpanded}
          className="inline-flex size-6 items-center justify-center rounded hover:bg-muted"
        >
          <span
            className={cn(
              "inline-block transition-transform",
              expand.isExpanded && "rotate-90",
            )}
          >
            ▶
          </span>
        </button>
      </td>
    );
  }
  return (
    <td
      className={cn(
        "h-10 px-3 align-middle text-sm",
        isActionCell && "w-px whitespace-nowrap",
        textCenter && "text-center",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
};

type TreeRowProps = {
  onCollapse?: () => void;
  row?: IRowData & { props?: { isExpanded?: boolean; isDetailsExpanded?: boolean } };
  children?: ReactNode;
  className?: string;
};

export const TreeRowWrapper = ({ children, className }: TreeRowProps) => (
  <tr className={className}>{children}</tr>
);

/* ============================================================
 * Additional table primitives
 * ============================================================ */

import type { ReactNode as RN } from "react";

export type IAction = {
  title?: ReactNode;
  onClick?: (event: React.MouseEvent, rowIndex: number) => void;
  isOutsideDropdown?: boolean;
  isDisabled?: boolean;
  isSeparator?: boolean;
  tooltip?: ReactNode;
};

export const ActionsColumn = ({
  items,
  rowData: _rd,
  isDisabled,
}: {
  items: IAction[];
  rowData?: unknown;
  isDisabled?: boolean;
}) => (
  <div className="flex justify-end gap-1">
    {items.map((a, i) =>
      a.isSeparator ? (
        <span key={i} aria-hidden className="mx-1 inline-block h-4 w-px bg-border" />
      ) : (
        <button
          key={i}
          type="button"
          disabled={isDisabled || a.isDisabled}
          onClick={(e) => a.onClick?.(e, 0)}
          className="rounded px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
        >
          {a.title}
        </button>
      ),
    )}
  </div>
);

export const ExpandableRowContent = ({
  children,
  className,
}: {
  children?: RN;
  className?: string;
}) => <div className={`p-3 ${className ?? ""}`}>{children}</div>;

export type IRowCell = { title?: RN; props?: Record<string, unknown> };
export type IRow = {
  cells?: Array<IRowCell | RN>;
  selected?: boolean;
  isOpen?: boolean;
  parent?: number;
};
export type IFormatter = (value?: unknown, extra?: unknown) => unknown;
export type IFormatterValueType = unknown;
export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
export enum TableVariant {
  compact = "compact",
}
