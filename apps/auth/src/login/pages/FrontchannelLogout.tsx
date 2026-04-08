import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useEffect } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function FrontchannelLogout(
  props: PageProps<
    Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { logout } = kcContext
  const { msg } = i18n

  useEffect(() => {
    if (logout.clients.length === 0 && logout.logoutRedirectUri) {
      window.location.replace(logout.logoutRedirectUri)
    }
  }, [logout.clients, logout.logoutRedirectUri])

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("frontchannel-logout.title")}
    >
      <p className="text-sm">{msg("frontchannel-logout.message")}</p>
      <ul className="list-inside list-disc text-xs">
        {logout.clients.map((client) => (
          <li key={client.name}>
            {client.name}
            <iframe
              src={client.frontChannelLogoutUrl}
              title={client.name}
              className="hidden"
            />
          </li>
        ))}
      </ul>
      {logout.logoutRedirectUri && (
        <a
          id="continue"
          href={logout.logoutRedirectUri}
          className="text-primary hover:underline text-xs"
        >
          {msg("doContinue")}
        </a>
      )}
    </Template>
  )
}
