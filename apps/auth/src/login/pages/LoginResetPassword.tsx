import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { FieldError } from "../components/FieldError"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginResetPassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, realm, auth, messagesPerField } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username")}
      displayInfo
      headerNode={msg("emailForgotTitle")}
      infoNode={
        <a href={url.loginUrl} className="text-primary hover:underline">
          &laquo; {msg("backToLogin")}
        </a>
      }
    >
      <form
        id="kc-reset-password-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="username">
            {!realm.loginWithEmailAllowed
              ? msg("username")
              : !realm.registrationEmailAsUsername
                ? msg("usernameOrEmail")
                : msg("email")}
          </Label>
          <Input size="xl"
            id="username"
            name="username"
            type="text"
            autoFocus
            defaultValue={auth.attemptedUsername ?? ""}
            aria-invalid={messagesPerField.existsError("username")}
          />
          <FieldError
            messagesPerField={messagesPerField}
            fieldName="username"
          />
        </div>
        <Button type="submit" size="xl" className="w-full">
          {msgStr("doSubmit")}
        </Button>
      </form>
    </Template>
  )
}
