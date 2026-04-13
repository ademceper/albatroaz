import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import { useScript } from "keycloakify/login/pages/LoginPasskeysConditionalAuthenticate.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { FieldError } from "../components/FieldError"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginPasskeysConditionalAuthenticate(
  props: PageProps<
    Extract<
      KcContext,
      { pageId: "login-passkeys-conditional-authenticate.ftl" }
    >,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    messagesPerField,
    login,
    url,
    usernameHidden,
    authenticators,
    registrationDisabled,
    realm,
  } = kcContext
  const { msg, msgStr } = i18n

  const authButtonId = "authenticateWebAuthnButton"
  useScript({ authButtonId, kcContext, i18n })

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
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
    >
      <form
        id="webauth"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        {!usernameHidden && (
          <div className="space-y-1.5">
            <Label htmlFor="username">{msg("username")}</Label>
            <Input size="xl"
              id="username"
              name="username"
              type="text"
              defaultValue={login.username ?? ""}
              autoFocus
              autoComplete="username webauthn"
              aria-invalid={messagesPerField.existsError("username")}
            />
            <FieldError
              messagesPerField={messagesPerField}
              fieldName="username"
            />
          </div>
        )}
        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
        <input type="hidden" id="authenticatorData" name="authenticatorData" />
        <input type="hidden" id="signature" name="signature" />
        <input type="hidden" id="credentialId" name="credentialId" />
        <input type="hidden" id="userHandle" name="userHandle" />
        <input type="hidden" id="error" name="error" />
        {authenticators !== undefined &&
          Object.keys(authenticators).length !== 0 && (
            <div className="space-y-1">
              {authenticators.authenticators?.map((authenticator) => (
                <input
                  key={authenticator.credentialId}
                  type="hidden"
                  name="authn_use_chk"
                  readOnly
                  value={authenticator.credentialId}
                />
              ))}
            </div>
          )}
        <Button id={authButtonId} type="submit" size="xl" className="w-full">
          {msgStr("passkey-doAuthenticate")}
        </Button>
      </form>
    </Template>
  )
}
