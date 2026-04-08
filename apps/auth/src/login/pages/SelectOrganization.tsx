import { Button } from "@albatroaz/ui/components/button"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function SelectOrganization(
  props: PageProps<
    Extract<KcContext, { pageId: "select-organization.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, user } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={advancedMsg("organization.select")}
    >
      <form
        id="kc-select-organization-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="organization">
            {advancedMsg("organization.name")}
          </Label>
          <Input
            id="organization"
            name="organization"
            list="organizations-list"
            autoFocus
            autoComplete="off"
          />
          <datalist id="organizations-list">
            {user.organizations.map((org) => (
              <option key={org.alias} value={org.alias}>
                {org.name ?? org.alias}
              </option>
            ))}
          </datalist>
        </div>
        <Button type="submit" size="lg" className="w-full">
          {msgStr("doContinue")}
        </Button>
        {/* avoid unused warning */}
        <span className="hidden">{msg("doLogIn")}</span>
      </form>
    </Template>
  )
}
