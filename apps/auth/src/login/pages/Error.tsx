import { ArrowLeftIcon } from "@phosphor-icons/react"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function ErrorPage(
  props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { message, client, skipLink } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("errorTitle")}
    >
      <p
        id="kc-error-message"
        className="text-sm"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied
        dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
      />
      {!skipLink && client?.baseUrl !== undefined && (
        <p className="text-xs">
          <a
            id="backToApplication"
            href={client.baseUrl}
            className="text-primary inline-flex items-center gap-1 hover:underline"
          >
            <ArrowLeftIcon className="size-3.5" />
            {msgStr("backToApplication").replace(/^(?:&laquo;|«)\s*/, "")}
          </a>
        </p>
      )}
    </Template>
  )
}
