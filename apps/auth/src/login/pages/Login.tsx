import { Button } from "@albatroaz/ui/components/button"
import { Checkbox } from "@albatroaz/ui/components/checkbox"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import { useScript } from "keycloakify/login/pages/Login.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import { FieldError } from "../components/FieldError"
import { PasswordField } from "../components/PasswordField"
import { SocialProviders } from "../components/SocialProviders"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext
  const { msg, msgStr } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)
  const webAuthnButtonId = "authenticateWebAuthnButton"

  useScript({ webAuthnButtonId, kcContext, i18n })

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
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      displayInfo={
        realm.password && realm.registrationAllowed && !registrationDisabled
      }
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
      {realm.password && (
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
                autoComplete={
                  enableWebAuthnConditionalUI ? "username webauthn" : "username"
                }
                aria-invalid={messagesPerField.existsError(
                  "username",
                  "password",
                )}
              />
              <FieldError
                messagesPerField={messagesPerField}
                fieldName="username"
                extraFieldNames={["password"]}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password">{msg("password")}</Label>
            <PasswordField
              i18n={i18n}
              inputId="password"
              name="password"
              autoComplete="current-password"
              aria-invalid={messagesPerField.existsError(
                "username",
                "password",
              )}
            />
            {usernameHidden && (
              <FieldError
                messagesPerField={messagesPerField}
                fieldName="username"
                extraFieldNames={["password"]}
              />
            )}
          </div>

          {(realm.rememberMe || realm.resetPasswordAllowed) && (
            <div className="flex items-center justify-between">
              {realm.rememberMe && !usernameHidden ? (
                <div className="flex items-center gap-2 text-xs">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    defaultChecked={!!login.rememberMe}
                  />
                  <Label htmlFor="rememberMe" className="text-xs">
                    {msg("rememberMe")}
                  </Label>
                </div>
              ) : (
                <span />
              )}
              {realm.resetPasswordAllowed && (
                <a
                  href={url.loginResetCredentialsUrl}
                  className="text-primary text-xs hover:underline"
                >
                  {msg("doForgotPassword")}
                </a>
              )}
            </div>
          )}

          <input
            type="hidden"
            id="id-hidden-input"
            name="credentialId"
            value={auth.selectedCredential}
          />
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
      )}

      {enableWebAuthnConditionalUI && (
        <>
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input
              type="hidden"
              id="authenticatorData"
              name="authenticatorData"
            />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>
          {authenticators !== undefined &&
            authenticators.authenticators.length !== 0 && (
              <form id="authn_select">
                {authenticators.authenticators.map((authenticator) => (
                  <input
                    key={authenticator.credentialId}
                    type="hidden"
                    name="authn_use_chk"
                    readOnly
                    value={authenticator.credentialId}
                  />
                ))}
              </form>
            )}
          <Button
            id={webAuthnButtonId}
            type="button"
            variant="outline"
            size="xl"
            className="w-full"
          >
            {msgStr("passkey-doAuthenticate")}
          </Button>
        </>
      )}
    </Template>
  )
}
