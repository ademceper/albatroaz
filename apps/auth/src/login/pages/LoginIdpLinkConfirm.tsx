import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginIdpLinkConfirm(
  props: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, idpAlias } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("confirmLinkIdpTitle")}
    >
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
          value="updateProfile"
          id="updateProfile"
        >
          {msgStr("confirmLinkIdpReviewProfile")}
        </Button>
        <Button
          type="submit"
          variant="outline"
          size="xl"
          className="w-full"
          name="submitAction"
          value="linkAccount"
          id="linkAccount"
        >
          {msgStr("confirmLinkIdpContinue", idpAlias)}
        </Button>
      </form>
    </Template>
  )
}
