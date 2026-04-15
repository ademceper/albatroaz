import { Input } from "@albatroaz/ui/components/input"
import { cn } from "@albatroaz/ui/lib/utils"
import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function Code(
  props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { code } = kcContext
  const { msg } = i18n
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.code ?? "")
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={code.success}
      headerNode={
        code.success
          ? msg("codeSuccessTitle")
          : msg("codeErrorTitle", code.error ?? "")
      }
    >
      <div id="kc-code" className="space-y-3">
        {code.success ? (
          <>
            <p className="text-sm">{msg("copyCodeInstruction")}</p>
            <div className="relative">
              <Input
                size="xl"
                id="code"
                value={code.code}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                className="pe-10 font-mono"
              />
              <button
                type="button"
                aria-label="Copy"
                onClick={handleCopy}
                className={cn(
                  "absolute end-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md outline-none transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  "focus-visible:ring-2 focus-visible:ring-ring/30",
                )}
              >
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </button>
            </div>
          </>
        ) : (
          <p
            className="text-destructive text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied
            dangerouslySetInnerHTML={{ __html: kcSanitize(code.error ?? "") }}
          />
        )}
      </div>
    </Template>
  )
}
