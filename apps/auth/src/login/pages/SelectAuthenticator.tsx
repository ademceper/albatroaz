import { CaretRightIcon } from "@phosphor-icons/react"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function SelectAuthenticator(
  props: PageProps<
    Extract<KcContext, { pageId: "select-authenticator.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, auth } = kcContext
  const { msg, advancedMsg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("loginChooseAuthenticator")}
    >
      <form
        id="kc-select-credential-form"
        action={url.loginAction}
        method="post"
        className="space-y-2"
      >
        {auth.authenticationSelections.map((authenticationSelection) => (
          <button
            key={authenticationSelection.authExecId}
            type="submit"
            name="authenticationExecution"
            value={authenticationSelection.authExecId}
            className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-md border p-3 text-start transition-colors"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">
                {advancedMsg(authenticationSelection.displayName)}
              </div>
              <div className="text-muted-foreground text-xs">
                {advancedMsg(authenticationSelection.helpText)}
              </div>
            </div>
            <CaretRightIcon className="text-muted-foreground" />
          </button>
        ))}
      </form>
    </Template>
  )
}
