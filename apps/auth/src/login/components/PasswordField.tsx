import { Input } from "@albatroaz/ui/components/input"
import { cn } from "@albatroaz/ui/lib/utils"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed"
import type * as React from "react"
import type { I18n } from "../i18n"

type Props = Omit<React.ComponentProps<"input">, "size"> & {
  i18n: I18n
  inputId: string
}

export function PasswordField({ i18n, inputId, className, ...props }: Props) {
  const { msgStr } = i18n
  const { isPasswordRevealed, toggleIsPasswordRevealed } =
    useIsPasswordRevealed({
      passwordInputId: inputId,
    })

  return (
    <div className="relative">
      <Input
        size="xl"
        id={inputId}
        type="password"
        className={cn("pe-10", className)}
        {...props}
      />
      <button
        type="button"
        aria-label={msgStr(
          isPasswordRevealed ? "hidePassword" : "showPassword",
        )}
        aria-controls={inputId}
        onClick={toggleIsPasswordRevealed}
        className="text-muted-foreground hover:text-foreground absolute end-2 top-1/2 -translate-y-1/2 inline-flex size-6 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/30 transition-colors"
      >
        {isPasswordRevealed ? (
          <EyeSlashIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  )
}
