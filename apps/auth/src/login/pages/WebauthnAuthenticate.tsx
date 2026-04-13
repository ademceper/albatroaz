import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function WebauthnAuthenticate(
  props: PageProps<
    Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, authenticators, shouldDisplayAuthenticators } = kcContext
  const { msg, msgStr } = i18n

  const authButtonId = "authenticateWebAuthnButton"
  useScript({ authButtonId, kcContext, i18n })

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo={false}
      headerNode={msg("webauthn-login-title")}
    >
      <div id="kc-form-webauthn" className="space-y-4">
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

        {shouldDisplayAuthenticators &&
          authenticators.authenticators.length > 0 && (
            <div className="space-y-2">
              {authenticators.authenticators.map((authenticator) => (
                <div
                  key={authenticator.credentialId ?? authenticator.label}
                  className="rounded-md border p-2 text-xs"
                >
                  {authenticator.label}
                </div>
              ))}
            </div>
          )}

        <Button id={authButtonId} type="button" size="xl" className="w-full">
          {msgStr("webauthn-doAuthenticate")}
        </Button>
      </div>
    </Template>
  )
}
