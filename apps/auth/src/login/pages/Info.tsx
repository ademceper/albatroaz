import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Info(
    props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const {
        messageHeader,
        message,
        requiredActions,
        skipLink,
        pageRedirectUri,
        actionUri,
        client,
    } = kcContext;
    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                messageHeader !== undefined
                    ? advancedMsg(messageHeader)
                    : advancedMsg(message.summary)
            }
        >
            <p className="text-sm">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied */}
                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                {requiredActions !== undefined && (
                    <b>
                        {requiredActions
                            .map((requiredAction) =>
                                advancedMsgStr(`requiredAction.${requiredAction}`),
                            )
                            .join(", ")}
                    </b>
                )}
            </p>
            {!skipLink && pageRedirectUri !== undefined ? (
                <p className="text-xs">
                    <a href={pageRedirectUri} className="text-primary hover:underline">
                        {msg("backToApplication")}
                    </a>
                </p>
            ) : actionUri !== undefined ? (
                <p className="text-xs">
                    <a href={actionUri} className="text-primary hover:underline">
                        {msg("proceedWithAction")}
                    </a>
                </p>
            ) : client.baseUrl !== undefined ? (
                <p className="text-xs">
                    <a href={client.baseUrl} className="text-primary hover:underline">
                        {msg("backToApplication")}
                    </a>
                </p>
            ) : null}
        </Template>
    );
}
