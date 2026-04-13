import { Button } from "@albatroaz/ui/components/button"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { type FormEventHandler, useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

type Props = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => React.JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function Register(props: Props) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props
  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)
  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes })
  const [areTermsAccepted, setAreTermsAccepted] = useState(false)

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (
      !recaptchaRequired ||
      (!recaptchaVisible && recaptchaAction === undefined)
    ) {
      return
    }
    e.preventDefault()
    const formElement = e.target as HTMLFormElement
    const captchaInput = formElement.querySelector(
      `input[name='g-recaptcha-response']`,
    )
    if (captchaInput) formElement.submit()
  }

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={
        messageHeader !== undefined
          ? advancedMsg(messageHeader)
          : msg("registerTitle")
      }
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
    >
      <form
        id="kc-register-form"
        action={url.registrationAction}
        method="post"
        className="space-y-4"
        onSubmit={onSubmit}
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />

        {termsAcceptanceRequired && (
          <TermsAcceptance
            i18n={i18n}
            areTermsAccepted={areTermsAccepted}
            onAreTermsAcceptedValueChange={setAreTermsAccepted}
          />
        )}

        {recaptchaRequired &&
          (recaptchaVisible || recaptchaAction === undefined) && (
            <div
              className="g-recaptcha"
              data-size="compact"
              data-sitekey={recaptchaSiteKey}
              data-action={recaptchaAction}
            />
          )}

        <div className="flex flex-col gap-2">
          {recaptchaRequired &&
          !recaptchaVisible &&
          recaptchaAction !== undefined ? (
            <Button
              type="submit"
              size="xl"
              className={`g-recaptcha w-full`}
              data-sitekey={recaptchaSiteKey}
              data-callback="onSubmitRegistration"
              data-action={recaptchaAction}
              disabled={
                !isFormSubmittable ||
                (termsAcceptanceRequired && !areTermsAccepted)
              }
            >
              {msgStr("doRegister")}
            </Button>
          ) : (
            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={
                !isFormSubmittable ||
                (termsAcceptanceRequired && !areTermsAccepted)
              }
            >
              {msgStr("doRegister")}
            </Button>
          )}
          <a
            href={url.loginUrl}
            className="text-xs hover:underline text-center"
          >
            {msg("backToLogin")}
          </a>
        </div>
      </form>
    </Template>
  )
}

function TermsAcceptance(props: {
  i18n: I18n
  areTermsAccepted: boolean
  onAreTermsAcceptedValueChange: (v: boolean) => void
}) {
  const { i18n, areTermsAccepted, onAreTermsAcceptedValueChange } = props
  const { msg } = i18n

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{msg("termsTitle")}</div>
      <div className="text-muted-foreground text-xs">{msg("termsText")}</div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          id="termsAccepted"
          name="termsAccepted"
          checked={areTermsAccepted}
          onChange={(e) => onAreTermsAcceptedValueChange(e.target.checked)}
        />
        {msg("acceptTerms")}
      </label>
    </div>
  )
}
