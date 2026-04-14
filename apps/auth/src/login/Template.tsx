import { Alert, AlertDescription } from "@albatroaz/ui/components/alert"
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useInitialize } from "keycloakify/login/Template.useInitialize"
import type { TemplateProps } from "keycloakify/login/TemplateProps"
import { useEffect } from "react"
import type { I18n } from "./i18n"
import type { KcContext } from "./KcContext"

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    kcContext,
    i18n,
    doUseDefaultCss,
    children,
  } = props

  const { msg, msgStr } = i18n
  const { realm, auth, url, message, isAppInitiatedAction } = kcContext

  useEffect(() => {
    document.title =
      documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name)
  }, [documentTitle, msgStr, realm.displayName, realm.name])

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss })

  if (!isReadyToRender) {
    return null
  }

  const messageIcon = (() => {
    switch (message?.type) {
      case "success":
        return <CheckCircleIcon weight="fill" />
      case "warning":
        return <WarningIcon weight="fill" />
      case "error":
        return <XCircleIcon weight="fill" />
      default:
        return <InfoIcon weight="fill" />
    }
  })()

  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[22rem] space-y-6">
        <header className="space-y-1">
          {auth?.showUsername && !auth.showResetCredentials ? (
            <>
              <h1 className="font-heading text-lg font-medium">
                {msg("loginAccountTitle")}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>{auth.attemptedUsername}</span>
                <a
                  href={url.loginRestartFlowUrl}
                  aria-label={msgStr("restartLoginTooltip")}
                  className="text-primary hover:underline"
                >
                  {msg("restartLoginTooltip")}
                </a>
              </p>
            </>
          ) : (
            <h1 className="font-heading text-lg font-medium">{headerNode}</h1>
          )}
          {displayRequiredFields && (
            <p className="text-muted-foreground text-xs">
              <span className="text-destructive">*</span> {msg("requiredFields")}
            </p>
          )}
        </header>

        <div className="space-y-4">
          {displayMessage && message !== undefined && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              {messageIcon}
              <AlertDescription>
                <span
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(message.summary),
                  }}
                />
              </AlertDescription>
            </Alert>
          )}

          {socialProvidersNode}

          {children}

          {auth?.showTryAnotherWayLink && (
            <form
              id="kc-select-try-another-way-form"
              action={url.loginAction}
              method="post"
            >
              <input type="hidden" name="tryAnotherWay" value="on" />
              <button
                type="submit"
                className="text-primary text-xs hover:underline"
              >
                {msg("doTryAnotherWay")}
              </button>
            </form>
          )}

          {displayInfo && (
            <div className="text-muted-foreground text-center text-xs">
              {infoNode}
            </div>
          )}
        </div>

        {isAppInitiatedAction && (
          <p className="text-muted-foreground text-center text-xs">
            {msg("backToApplication")}
          </p>
        )}
      </div>
    </div>
  )
}
