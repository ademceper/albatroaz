import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import { Button } from "@albatroaz/ui/components/button";
import { Checkbox } from "@albatroaz/ui/components/checkbox";

export default function LoginRecoveryAuthnCodeConfig(
    props: PageProps<
        Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>,
        I18n
    >,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    useScript({ olRecoveryCodesListId: "kc-recovery-codes-list", i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("recovery-code-config-header")}
        >
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                <strong>{msg("recovery-code-config-warning-title")}</strong>
                <p>{msg("recovery-code-config-warning-message")}</p>
            </div>
            <ol id="kc-recovery-codes-list" className="grid grid-cols-2 gap-2 font-mono text-xs">
                {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, i) => (
                    <li key={i} className="rounded border p-2">
                        <span className="text-muted-foreground me-2">{i + 1}:</span>
                        {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
                    </li>
                ))}
            </ol>
            <div className="flex gap-2">
                <Button type="button" id="printRecoveryCodes" variant="outline" size="lg">
                    {msg("recovery-codes-print")}
                </Button>
                <Button type="button" id="downloadRecoveryCodes" variant="outline" size="lg">
                    {msg("recovery-codes-download")}
                </Button>
                <Button type="button" id="copyRecoveryCodes" variant="outline" size="lg">
                    {msg("recovery-codes-copy")}
                </Button>
            </div>
            <form
                action={url.loginAction}
                method="post"
                id="kc-recovery-codes-settings-form"
                className="space-y-4"
            >
                <input
                    type="hidden"
                    name="generatedRecoveryAuthnCodes"
                    value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString}
                />
                <input
                    type="hidden"
                    name="generatedAt"
                    value={recoveryAuthnCodesConfigBean.generatedAt}
                />
                <input
                    type="hidden"
                    id="userLabel"
                    name="userLabel"
                    value={msgStr("recovery-codes-label-default")}
                />
                <label className="flex items-center gap-2 text-xs">
                    <Checkbox
                        id="kcRecoveryCodesConfirmationCheck"
                        name="kcRecoveryCodesConfirmationCheck"
                    />
                    {msg("recovery-codes-confirmation-message")}
                </label>
                <div className="flex gap-2">
                    <Button type="submit" size="lg" className="flex-1" id="saveRecoveryAuthnCodesBtn">
                        {msgStr("recovery-codes-action-complete")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button
                            type="submit"
                            variant="outline"
                            size="lg"
                            id="cancelRecoveryAuthnCodesBtn"
                            name="cancel-aia"
                            value="true"
                        >
                            {msgStr("recovery-codes-action-cancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
