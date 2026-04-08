import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginIdpLinkEmail(
  props: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-email.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, brokerContext, idpAlias } = kcContext
  const { msg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("emailLinkIdpTitle", idpAlias)}
    >
      <p className="text-sm">
        {msg(
          "emailLinkIdp1",
          idpAlias,
          brokerContext.username,
          brokerContext.username,
        )}
      </p>
      <p className="text-muted-foreground text-xs">
        {msg("emailLinkIdp2")}{" "}
        <a href={url.loginAction} className="text-primary hover:underline">
          {msg("doClickHere")}
        </a>{" "}
        {msg("emailLinkIdp3")}
      </p>
      <p className="text-muted-foreground text-xs">
        {msg("emailLinkIdp4")}{" "}
        <a href={url.loginAction} className="text-primary hover:underline">
          {msg("doClickHere")}
        </a>{" "}
        {msg("emailLinkIdp5")}
      </p>
    </Template>
  )
}
