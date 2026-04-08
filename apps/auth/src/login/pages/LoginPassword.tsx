import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginPassword.useScript";
import { Label } from "@albatroaz/ui/components/label";
import { Button } from "@albatroaz/ui/components/button";
import { PasswordField } from "../components/PasswordField";
import { FieldError } from "../components/FieldError";

export default function LoginPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    useScript({ webAuthnButtonId: "authenticateWebAuthnButton", kcContext, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password")}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-form-login"
                onSubmit={() => {
                    setIsLoginButtonDisabled(true);
                    return true;
                }}
                action={url.loginAction}
                method="post"
                className="space-y-4"
            >
                <div className="space-y-1.5">
                    <Label htmlFor="password">{msg("password")}</Label>
                    <PasswordField
                        i18n={i18n}
                        inputId="password"
                        name="password"
                        autoComplete="current-password"
                        autoFocus
                        tabIndex={2}
                        aria-invalid={messagesPerField.existsError("password")}
                    />
                    <FieldError messagesPerField={messagesPerField} fieldName="password" />
                </div>
                {realm.resetPasswordAllowed && (
                    <a
                        href={url.loginResetCredentialsUrl}
                        className="text-primary text-xs hover:underline"
                    >
                        {msg("doForgotPassword")}
                    </a>
                )}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoginButtonDisabled}
                    tabIndex={3}
                    name="login"
                    id="kc-login"
                >
                    {msgStr("doLogIn")}
                </Button>
            </form>
        </Template>
    );
}
