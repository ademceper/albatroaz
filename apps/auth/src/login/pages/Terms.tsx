import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function Terms(
  props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("termsTitle")}
    >
      <div id="kc-terms-text" className="text-sm whitespace-pre-line">
        {msg("termsText")}
      </div>
      <form
        className="flex gap-2"
        action={url.loginAction}
        method="POST"
        id="kc-terms-form"
      >
        <Button
          type="submit"
          size="xl"
          className="flex-1"
          name="accept"
          id="kc-accept"
        >
          {msgStr("doAccept")}
        </Button>
        <Button
          type="submit"
          variant="outline"
          size="xl"
          name="cancel"
          id="kc-decline"
        >
          {msgStr("doDecline")}
        </Button>
      </form>
    </Template>
  )
}
