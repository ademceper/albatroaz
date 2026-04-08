import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@albatroaz/ui/components/input";

export default function Code(
    props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { code } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={code.success}
            headerNode={code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error ?? "")}
        >
            <div id="kc-code" className="space-y-3">
                {code.success ? (
                    <>
                        <p className="text-sm">{msg("copyCodeInstruction")}</p>
                        <Input value={code.code} id="code" readOnly />
                    </>
                ) : (
                    <p
                        className="text-destructive text-sm"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied
                        dangerouslySetInnerHTML={{ __html: kcSanitize(code.error ?? "") }}
                    />
                )}
            </div>
        </Template>
    );
}
