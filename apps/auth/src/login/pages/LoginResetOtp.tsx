import { Button } from "@albatroaz/ui/components/button"
import { Label } from "@albatroaz/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@albatroaz/ui/components/radio-group"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginResetOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, configuredOtpCredentials } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("doLogIn")}
    >
      <p className="text-sm">{msg("loginChooseAuthenticator")}</p>
      <form action={url.loginAction} method="post" className="space-y-4">
        <RadioGroup
          name="selectedCredentialId"
          defaultValue={configuredOtpCredentials.selectedCredentialId}
        >
          {configuredOtpCredentials.userOtpCredentials.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 rounded-md border p-2 text-sm"
            >
              <RadioGroupItem value={c.id} id={`kc-otp-credential-${c.id}`} />
              <Label
                htmlFor={`kc-otp-credential-${c.id}`}
                className="cursor-pointer text-sm"
              >
                {c.userLabel}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button type="submit" size="xl" className="w-full">
          {msgStr("doSubmit")}
        </Button>
      </form>
    </Template>
  )
}
