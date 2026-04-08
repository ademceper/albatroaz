import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginVerifyEmail(
    props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, user } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailVerifyTitle")}
        >
            <p className="text-sm">{msg("emailVerifyInstruction1", user?.email ?? "")}</p>
            <p className="text-muted-foreground text-xs">
                {msg("emailVerifyInstruction2")}{" "}
                <a href={url.loginAction} className="text-primary hover:underline">
                    {msg("doClickHere")}
                </a>{" "}
                {msg("emailVerifyInstruction3")}
            </p>
        </Template>
    );
}
