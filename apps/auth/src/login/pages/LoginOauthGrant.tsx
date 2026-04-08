import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginOauthGrant(
  props: PageProps<
    Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, oauth, client } = kcContext
  const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={
        <>
          {client.attributes.logoUri && (
            <img
              src={client.attributes.logoUri}
              alt=""
              className="mx-auto mb-2 max-h-12"
            />
          )}
          {msg("oauthGrantTitle")}{" "}
          <strong>{advancedMsg(client.name ?? client.clientId)}</strong>
        </>
      }
    >
      <div id="kc-oauth" className="space-y-3">
        <h3 className="text-sm font-medium">{msg("oauthGrantRequest")}</h3>
        <ul className="space-y-1 text-xs">
          {oauth.clientScopesRequested.map((clientScope) => (
            <li
              key={clientScope.consentScreenText}
              className="rounded border p-2"
            >
              <span>{advancedMsg(clientScope.consentScreenText)}</span>
              {clientScope.dynamicScopeParameter && (
                <>
                  :{" "}
                  <span className="text-muted-foreground">
                    {clientScope.dynamicScopeParameter}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
        {(client.attributes.policyUri || client.attributes.tosUri) && (
          <p className="text-muted-foreground text-xs">
            {client.name
              ? msg("oauthGrantInformation", advancedMsgStr(client.name))
              : msg("oauthGrantInformation", client.clientId)}
            {client.attributes.tosUri && (
              <>
                {" "}
                {msg("oauthGrantTos")}{" "}
                <a
                  href={client.attributes.tosUri}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {advancedMsg("oauthGrantTosLink")}
                </a>
              </>
            )}
            {client.attributes.policyUri && (
              <>
                {" "}
                {msg("oauthGrantPolicy")}{" "}
                <a
                  href={client.attributes.policyUri}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {advancedMsg("oauthGrantPolicyLink")}
                </a>
              </>
            )}
          </p>
        )}
      </div>
      <form className="flex gap-2" action={url.oauthAction} method="POST">
        <input type="hidden" name="code" value={oauth.code} />
        <Button
          type="submit"
          variant="outline"
          size="lg"
          name="cancel"
          className="flex-1"
        >
          {msgStr("doDecline")}
        </Button>
        <Button type="submit" size="lg" name="accept" className="flex-1">
          {msgStr("doYes")}
        </Button>
      </form>
    </Template>
  )
}
