import { Button } from "@albatroaz/ui/components/button"
import { Checkbox } from "@albatroaz/ui/components/checkbox"
import { Label } from "@albatroaz/ui/components/label"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { FieldError } from "../components/FieldError"
import { PasswordField } from "../components/PasswordField"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginUpdatePassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-update-password.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, messagesPerField, isAppInitiatedAction } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={
        !messagesPerField.existsError("password", "password-confirm")
      }
      headerNode={msg("updatePasswordTitle")}
    >
      <form
        id="kc-passwd-update-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="password-new">{msg("passwordNew")}</Label>
          <PasswordField
            i18n={i18n}
            inputId="password-new"
            name="password-new"
            autoFocus
            autoComplete="new-password"
            aria-invalid={messagesPerField.existsError(
              "password",
              "password-confirm",
            )}
          />
          <FieldError
            messagesPerField={messagesPerField}
            fieldName="password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password-confirm">{msg("passwordConfirm")}</Label>
          <PasswordField
            i18n={i18n}
            inputId="password-confirm"
            name="password-confirm"
            autoComplete="new-password"
            aria-invalid={messagesPerField.existsError("password-confirm")}
          />
          <FieldError
            messagesPerField={messagesPerField}
            fieldName="password-confirm"
          />
        </div>
        {isAppInitiatedAction && (
          <div className="flex items-center gap-2 text-xs">
            <Checkbox
              id="logout-sessions"
              name="logout-sessions"
              defaultChecked
            />
            <Label htmlFor="logout-sessions" className="text-xs">
              {msg("logoutOtherSessions")}
            </Label>
          </div>
        )}
        <div className="flex gap-2">
          <Button type="submit" size="lg" className="flex-1">
            {msgStr("doSubmit")}
          </Button>
          {isAppInitiatedAction && (
            <Button
              type="submit"
              variant="outline"
              size="lg"
              name="cancel-aia"
              value="true"
            >
              {msgStr("doCancel")}
            </Button>
          )}
        </div>
      </form>
    </Template>
  )
}
