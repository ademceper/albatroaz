import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function SamlPostForm(
    props: PageProps<Extract<KcContext, { pageId: "saml-post-form.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { samlPost } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("saml.post-form.title")}
        >
            <p className="text-sm">{msg("saml.post-form.message")}</p>
            <form name="saml-post-binding" method="post" action={samlPost.url}>
                {samlPost.SAMLRequest && <input type="hidden" name="SAMLRequest" value={samlPost.SAMLRequest} />}
                {samlPost.SAMLResponse && <input type="hidden" name="SAMLResponse" value={samlPost.SAMLResponse} />}
                {samlPost.relayState && <input type="hidden" name="RelayState" value={samlPost.relayState} />}
                <noscript>
                    <button type="submit">{msg("saml.post-form.message")}</button>
                </noscript>
            </form>
        </Template>
    );
}
