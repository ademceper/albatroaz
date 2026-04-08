import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@albatroaz/ui/components/radio-group"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { FieldError } from "../components/FieldError"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { otpLogin, url, messagesPerField } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("totp")}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-otp-login-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        {otpLogin.userOtpCredentials.length > 1 && (
          <RadioGroup
            name="selectedCredentialId"
            defaultValue={otpLogin.selectedCredentialId}
          >
            {otpLogin.userOtpCredentials.map((c) => (
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
        )}
        <div className="space-y-1.5">
          <Label htmlFor="otp">{msg("loginOtpOneTime")}</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            autoComplete="off"
            autoFocus
            aria-invalid={messagesPerField.existsError("totp")}
          />
          <FieldError messagesPerField={messagesPerField} fieldName="totp" />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          name="login"
          id="kc-login"
        >
          {msgStr("doLogIn")}
        </Button>
      </form>
    </Template>
  )
}
