import { Alert, AlertDescription } from "@albatroaz/ui/components/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@albatroaz/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@albatroaz/ui/components/select"
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

  const { msg, msgStr, currentLanguage, enabledLanguages } = i18n
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
      <div className="w-full max-w-md space-y-4">
        {realm.internationalizationEnabled &&
          enabledLanguages !== undefined &&
          enabledLanguages.length > 1 && (
            <div className="flex justify-end">
              <Select
                value={currentLanguage.languageTag}
                onValueChange={(tag) => {
                  const lang = enabledLanguages.find(
                    (l) => l.languageTag === tag,
                  )
                  if (lang) window.location.href = lang.href
                }}
              >
                <SelectTrigger size="sm" className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {enabledLanguages.map(({ languageTag, label }) => (
                    <SelectItem key={languageTag} value={languageTag}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        <Card>
          <CardHeader>
            {auth?.showUsername && !auth.showResetCredentials ? (
              <>
                <CardTitle>{msg("loginAccountTitle")}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{auth.attemptedUsername}</span>
                  <a
                    href={url.loginRestartFlowUrl}
                    aria-label={msgStr("restartLoginTooltip")}
                    className="text-primary hover:underline"
                  >
                    {msg("restartLoginTooltip")}
                  </a>
                </CardDescription>
              </>
            ) : (
              <CardTitle>{headerNode}</CardTitle>
            )}
            {displayRequiredFields && (
              <CardDescription>
                <span className="text-destructive">*</span>{" "}
                {msg("requiredFields")}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
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
            {socialProvidersNode}
            {displayInfo && (
              <div className="text-muted-foreground text-center text-xs">
                {infoNode}
              </div>
            )}
          </CardContent>
          {isAppInitiatedAction && (
            <CardFooter className="text-muted-foreground text-xs justify-center">
              {msg("backToApplication")}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

