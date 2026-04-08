import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@albatroaz/ui/components/input";
import { Label } from "@albatroaz/ui/components/label";
import { Button } from "@albatroaz/ui/components/button";

export default function LoginOauth2DeviceVerifyUserCode(
    props: PageProps<
        Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>,
        I18n
    >,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("oauth2DeviceVerificationTitle")}
        >
            <form
                id="kc-user-verify-device-user-code-form"
                action={url.oauth2DeviceVerificationAction}
                method="post"
                className="space-y-4"
            >
                <div className="space-y-1.5">
                    <Label htmlFor="device_user_code">{msg("verifyOAuth2DeviceUserCode")}</Label>
                    <Input id="device_user_code" name="device_user_code" type="text" autoFocus autoComplete="off" />
                </div>
                <Button type="submit" size="lg" className="w-full">
                    {msgStr("doSubmit")}
                </Button>
            </form>
        </Template>
    );
}
