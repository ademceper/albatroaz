import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginIdpLinkConfirmOverride(
  props: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url } = kcContext
  const { msg, advancedMsg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={advancedMsg("confirmOverrideIdpTitle")}
    >
      <p className="text-sm">{msg("pageExpiredMsg1")}</p>
      <form
        id="kc-register-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <Button
          type="submit"
          size="xl"
          className="w-full"
          name="submitAction"
          value="confirmOverride"
          id="confirmOverride"
        >
          {advancedMsg("confirmIdpContinueOverride")}
        </Button>
      </form>
    </Template>
  )
}
