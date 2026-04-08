import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function DeleteAccountConfirm(
  props: PageProps<
    Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, triggered_from_aia } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("deleteAccountConfirm")}
    >
      <p className="text-sm">{msg("irreversibleAction")}</p>
      <p className="text-muted-foreground text-xs">{msg("deletingImplies")}</p>
      <ul className="list-inside list-disc text-xs">
        <li>{msg("loggingOutImmediately")}</li>
        <li>{msg("errasingData")}</li>
      </ul>
      <p className="text-xs">{msg("finalDeletionConfirmation")}</p>
      <form action={url.loginAction} method="post" className="flex gap-2">
        <Button
          type="submit"
          variant="destructive"
          size="lg"
          className="flex-1"
          name="confirm"
          value="confirm"
        >
          {msgStr("doConfirmDelete")}
        </Button>
        {triggered_from_aia && (
          <Button
            type="submit"
            variant="outline"
            size="lg"
            name="cancel-aia"
            value="true"
          >
            {msgStr("doCancel")}
          </Button>
        )}
      </form>
    </Template>
  )
}
