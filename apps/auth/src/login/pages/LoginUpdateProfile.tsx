import { Button } from "@albatroaz/ui/components/button"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

type Props = PageProps<
  Extract<KcContext, { pageId: "login-update-profile.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => React.JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function LoginUpdateProfile(props: Props) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props
  const { messagesPerField, url, isAppInitiatedAction } = kcContext
  const { msg, msgStr } = i18n

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)
  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes })

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
      headerNode={msg("loginProfileTitle")}
    >
      <form
        id="kc-update-profile-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            size="xl"
            className="flex-1"
            disabled={!isFormSubmittable}
          >
            {msgStr("doSubmit")}
          </Button>
          {isAppInitiatedAction && (
            <Button
              type="submit"
              variant="outline"
              size="xl"
              name="cancel-aia"
              value="true"
            >
              {msgStr("doCancel")}
            </Button>
          )}
        </div>
      </form>
    </Template>
  )
}
