/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/LinkedAccountsToolbar.tsx" --revert
 */

import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@albatroaz/ui/components/button";
import { Input } from "@albatroaz/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@albatroaz/ui/components/select";

type Props = {
  onFilter: (nameFilter: string) => void;
  count: number;
  first: number;
  max: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
  onPerPageSelect: (max: number, first: number) => void;
  hasNext: boolean;
};

export const LinkedAccountsToolbar = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  onFilter,
  hasNext,
}: Props) => {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");
  const page = Math.round(first / max) + 1;
  const lastIndex = first + count;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon className="absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("filterByName")}
          aria-label={t("filterByName")}
          value={nameFilter}
          className="ps-8"
          onChange={(e) => setNameFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onFilter(nameFilter);
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(max)}
          onValueChange={(v) => onPerPageSelect(Number(v), 0)}
        >
          <SelectTrigger size="sm" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">5</SelectItem>
            <SelectItem value="11">10</SelectItem>
            <SelectItem value="21">20</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground">
          {first + 1} - {lastIndex}
        </span>

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={page === 1}
          onClick={() => onPreviousClick((page - 1) * max)}
        >
          <CaretLeftIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!hasNext}
          onClick={() => onNextClick((page - 1) * max)}
        >
          <CaretRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
