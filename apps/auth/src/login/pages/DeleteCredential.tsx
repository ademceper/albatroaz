import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function DeleteCredential(
  props: PageProps<
    Extract<KcContext, { pageId: "delete-credential.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, credentialLabel } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("deleteCredentialTitle", credentialLabel)}
    >
      <p className="text-sm">
        {msg("deleteCredentialMessage", credentialLabel)}
      </p>
      <form action={url.loginAction} method="post" className="flex gap-2">
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          name="accept"
          id="kc-accept"
        >
          {msgStr("doConfirmDelete")}
        </Button>
        <Button
          type="submit"
          variant="outline"
          size="lg"
          name="cancel-aia"
          value="true"
        >
          {msgStr("doCancel")}
        </Button>
      </form>
    </Template>
  )
}
