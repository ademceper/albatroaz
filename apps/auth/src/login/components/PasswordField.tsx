import { Button } from "@albatroaz/ui/components/button"
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
      <Input size="xl"
        id={inputId}
        type="password"
        className={cn("pe-8", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute end-0.5 top-1/2 -translate-y-1/2"
        aria-label={msgStr(
          isPasswordRevealed ? "hidePassword" : "showPassword",
        )}
        aria-controls={inputId}
        onClick={toggleIsPasswordRevealed}
      >
        {isPasswordRevealed ? <EyeSlashIcon /> : <EyeIcon />}
      </Button>
    </div>
  )
}
