import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@albatroaz/ui/components/button";

export default function WebauthnError(
    props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("webauthn-error-title")}
        >
            <form id="kc-error-credential-form" action={url.loginAction} method="post" className="space-y-4">
                <div className="flex gap-2">
                    <Button type="submit" id="kc-try-again" name="try-again" value="on" size="lg" className="flex-1">
                        {msgStr("doTryAgain")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button type="submit" variant="outline" size="lg" name="cancel-aia" value="true">
                            {msgStr("doCancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
