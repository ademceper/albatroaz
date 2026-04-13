import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function WebauthnRegister(
  props: PageProps<
    Extract<KcContext, { pageId: "webauthn-register.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, isSetRetry, isAppInitiatedAction } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

  const registerButtonId = "registerWebAuthnBtn"
  useScript({ authButtonId: registerButtonId, kcContext, i18n })

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("webauthn-registration-title")}
    >
      <form
        id="register"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="authenticatorLabel">
            {advancedMsg("webauthn-label")}
          </Label>
          <Input id="authenticatorLabel" name="authenticatorLabel" autoFocus />
        </div>
        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
        <input type="hidden" id="attestationObject" name="attestationObject" />
        <input
          type="hidden"
          id="publicKeyCredentialId"
          name="publicKeyCredentialId"
        />
        <input type="hidden" id="transports" name="transports" />
        <input type="hidden" id="error" name="error" />
        <div className="flex gap-2">
          <Button
            id={registerButtonId}
            type="button"
            size="xl"
            className="flex-1"
          >
            {msgStr("doRegisterSecurityKey")}
          </Button>
          {!isSetRetry && isAppInitiatedAction && (
            <Button
              type="submit"
              variant="outline"
              size="xl"
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
