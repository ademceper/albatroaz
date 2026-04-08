import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@albatroaz/ui/components/button";

export default function LinkIdpAction(
    props: PageProps<Extract<KcContext, { pageId: "link-idp-action.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, idpDisplayName } = kcContext;
    const { msgStr, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={advancedMsg("linkIdpTitle")}
        >
            <p className="text-sm">{advancedMsg("linkIdpInfo", idpDisplayName)}</p>
            <form action={url.loginAction} method="post" className="flex gap-2">
                <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    name="submitAction"
                    value="confirm"
                >
                    {advancedMsg("confirm")}
                </Button>
                <Button
                    type="submit"
                    variant="outline"
                    size="lg"
                    name="submitAction"
                    value="cancel"
                >
                    {msgStr("doCancel")}
                </Button>
            </form>
        </Template>
    );
}
