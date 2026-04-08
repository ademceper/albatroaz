import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import { Input } from "@albatroaz/ui/components/input";
import { Label } from "@albatroaz/ui/components/label";
import { Button } from "@albatroaz/ui/components/button";
import { Checkbox } from "@albatroaz/ui/components/checkbox";
import { FieldError } from "../components/FieldError";
import { SocialProviders } from "../components/SocialProviders";

export default function LoginUsername(
    props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        registrationDisabled,
        messagesPerField,
    } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    useScript({ webAuthnButtonId: "authenticateWebAuthnButton", kcContext, i18n });

    const usernameLabel = !realm.loginWithEmailAllowed
        ? msg("username")
        : !realm.registrationEmailAsUsername
          ? msg("usernameOrEmail")
          : msg("email");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("doLogIn")}
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <span>
                    {msg("noAccount")}{" "}
                    <a href={url.registrationUrl} className="text-primary hover:underline">
                        {msg("doRegister")}
                    </a>
                </span>
            }
            socialProvidersNode={
                <SocialProviders social={social} realm={realm} i18n={i18n} />
            }
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
                {!usernameHidden && (
                    <div className="space-y-1.5">
                        <Label htmlFor="username">{usernameLabel}</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            tabIndex={2}
                            defaultValue={login.username ?? ""}
                            autoFocus
                            autoComplete="username"
                            aria-invalid={messagesPerField.existsError("username")}
                        />
                        <FieldError messagesPerField={messagesPerField} fieldName="username" />
                    </div>
                )}
                {realm.rememberMe && !usernameHidden && (
                    <label className="flex items-center gap-2 text-xs">
                        <Checkbox
                            id="rememberMe"
                            name="rememberMe"
                            defaultChecked={!!login.rememberMe}
                            tabIndex={3}
                        />
                        {msg("rememberMe")}
                    </label>
                )}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoginButtonDisabled}
                    tabIndex={4}
                    name="login"
                    id="kc-login"
                >
                    {msgStr("doLogIn")}
                </Button>
            </form>
        </Template>
    );
}
