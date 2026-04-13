import { Button } from "@albatroaz/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginX509Info(
  props: PageProps<Extract<KcContext, { pageId: "login-x509-info.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, x509 } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-x509-login-info"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <div className="rounded-md border p-3 text-xs">
          <strong>{msg("clientCertificate")}</strong>
          {x509.formData.subjectDN ? (
            <p className="mt-1">
              {msg("doX509Login")}: {x509.formData.subjectDN}
            </p>
          ) : (
            <p className="text-muted-foreground mt-1">{msg("noCertificate")}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="xl" className="flex-1" name="login">
            {msgStr("doContinue")}
          </Button>
          {x509.formData.isUserEnabled && (
            <Button type="submit" variant="outline" size="xl" name="cancel">
              {msgStr("doIgnore")}
            </Button>
          )}
        </div>
      </form>
    </Template>
  )
}
