import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { FieldError } from "../components/FieldError"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginRecoveryAuthnCodeInput(
  props: PageProps<
    Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("recoveryCodeInput")}
      headerNode={msg("auth-recovery-code-header")}
    >
      <form
        id="kc-recovery-code-login-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="recoveryCodeInput">
            {msg(
              "auth-recovery-code-prompt",
              `${recoveryAuthnCodesInputBean.codeNumber}`,
            )}
          </Label>
          <Input size="xl"
            id="recoveryCodeInput"
            name="recoveryCodeInput"
            autoComplete="off"
            autoFocus
            aria-invalid={messagesPerField.existsError("recoveryCodeInput")}
          />
          <FieldError
            messagesPerField={messagesPerField}
            fieldName="recoveryCodeInput"
          />
        </div>
        <Button type="submit" size="xl" className="w-full">
          {msgStr("doLogIn")}
        </Button>
      </form>
    </Template>
  )
}
