import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import { FieldError } from "../components/FieldError"
import { SocialProviders } from "../components/SocialProviders"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginUsername(
  props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    registrationDisabled,
    messagesPerField,
  } = kcContext
  const { msg, msgStr } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)
  useScript({ webAuthnButtonId: "authenticateWebAuthnButton", kcContext, i18n })

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msg("username")
    : !realm.registrationEmailAsUsername
      ? msg("usernameOrEmail")
      : msg("email")

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username")}
      headerNode={msg("doLogIn")}
      displayInfo={realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <a
            href={url.registrationUrl}
            className="text-primary hover:underline"
          >
            {msg("doRegister")}
          </a>
        </span>
      }
      socialProvidersNode={
        <SocialProviders social={social} realm={realm} i18n={i18n} />
      }
    >
      <form
        id="kc-form-login"
        onSubmit={() => {
          setIsLoginButtonDisabled(true)
          return true
        }}
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        {!usernameHidden && (
          <div className="space-y-1.5">
            <Label htmlFor="username">{usernameLabel}</Label>
            <Input size="xl"
              id="username"
              name="username"
              type="text"
              defaultValue={login.username ?? ""}
              autoFocus
              autoComplete="username"
              aria-invalid={messagesPerField.existsError("username")}
            />
            <FieldError
              messagesPerField={messagesPerField}
              fieldName="username"
            />
          </div>
        )}
        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={isLoginButtonDisabled}
          name="login"
          id="kc-login"
        >
          {msgStr("doLogIn")}
        </Button>
      </form>
    </Template>
  )
}
