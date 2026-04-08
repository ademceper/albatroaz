import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@albatroaz/ui/components/button";
import { RadioGroup, RadioGroupItem } from "@albatroaz/ui/components/radio-group";

export default function LoginResetOtp(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, configuredOtpCredentials } = kcContext;
    const { msg, msgStr } = i18n;

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
                        <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm">
                            <RadioGroupItem value={c.id} id={`kc-otp-credential-${c.id}`} />
                            {c.userLabel}
                        </label>
                    ))}
                </RadioGroup>
                <Button type="submit" size="lg" className="w-full">
                    {msgStr("doSubmit")}
                </Button>
            </form>
        </Template>
    );
}
