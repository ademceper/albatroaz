import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LogoutConfirm(
  props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, client, logoutConfirm } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("logoutConfirmTitle")}
    >
      <p className="text-sm">{msg("logoutConfirmHeader")}</p>
      <form
        action={url.logoutConfirmAction}
        method="POST"
        id="kc-logout-confirm-form"
      >
        <input type="hidden" name="session_code" value={logoutConfirm.code} />
        <Button
          type="submit"
          size="xl"
          className="w-full"
          name="confirmLogout"
          id="kc-logout"
        >
          {msgStr("doLogout")}
        </Button>
      </form>
      {!logoutConfirm.skipLink && client.baseUrl !== undefined && (
        <p className="text-xs">
          <a href={client.baseUrl} className="text-primary hover:underline">
            {msg("backToApplication")}
          </a>
        </p>
      )}
    </Template>
  )
}
