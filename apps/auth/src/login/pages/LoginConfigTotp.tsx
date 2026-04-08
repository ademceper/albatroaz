import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@albatroaz/ui/components/input";
import { Label } from "@albatroaz/ui/components/label";
import { Button } from "@albatroaz/ui/components/button";
import { FieldError } from "../components/FieldError";

export default function LoginConfigTotp(
    props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
            headerNode={msg("loginTotpTitle")}
        >
            <ol className="list-inside list-decimal space-y-2 text-sm">
                <li>
                    <span>{msg("loginTotpStep1")}</span>
                    <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        {totp.supportedApplications.map((app: string) => (
                            <li key={app} className="rounded border p-1">
                                {advancedMsg(app)}
                            </li>
                        ))}
                    </ul>
                </li>
                {mode === "manual" ? (
                    <>
                        <li>
                            {msg("loginTotpManualStep2")}
                            <pre className="mt-2 rounded bg-muted p-2 text-xs">{totp.totpSecretEncoded}</pre>
                            <a href={totp.qrUrl} className="text-primary text-xs hover:underline">
                                {msg("loginTotpScanBarcode")}
                            </a>
                        </li>
                        <li>
                            {msg("loginTotpManualStep3")}
                            <ul className="mt-2 text-xs">
                                <li>
                                    {msg("loginTotpType")}: {advancedMsg(`loginTotp.${totp.policy.type}`)}
                                </li>
                                <li>
                                    {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                </li>
                                <li>
                                    {msg("loginTotpDigits")}: {totp.policy.digits}
                                </li>
                                {totp.policy.type === "totp" ? (
                                    <li>
                                        {msg("loginTotpInterval")}: {totp.policy.period}
                                    </li>
                                ) : (
                                    <li>
                                        {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                    </li>
                                )}
                            </ul>
                        </li>
                    </>
                ) : (
                    <li>
                        {msg("loginTotpStep2")}
                        <img
                            src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                            alt="Figure: Barcode"
                            className="my-2 rounded border"
                        />
                        <a href={totp.manualUrl} className="text-primary text-xs hover:underline">
                            {msg("loginTotpUnableToScan")}
                        </a>
                    </li>
                )}
                <li>
                    {msg("loginTotpStep3")}
                    {msg("loginTotpStep3DeviceName")}
                </li>
            </ol>

            <form id="kc-totp-settings-form" action={url.loginAction} method="post" className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="totp">{msg("authenticatorCode")}</Label>
                    <Input
                        id="totp"
                        name="totp"
                        type="text"
                        autoComplete="off"
                        aria-invalid={messagesPerField.existsError("totp")}
                    />
                    <FieldError messagesPerField={messagesPerField} fieldName="totp" />
                    <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                    {mode && <input type="hidden" id="mode" value={mode} />}
                </div>
                {totp.otpCredentials.length >= 1 && (
                    <div className="space-y-1.5">
                        <Label htmlFor="userLabel">{advancedMsg("loginOtpDeviceName")}</Label>
                        <Input
                            id="userLabel"
                            name="userLabel"
                            type="text"
                            autoComplete="off"
                            aria-invalid={messagesPerField.existsError("userLabel")}
                        />
                        <FieldError messagesPerField={messagesPerField} fieldName="userLabel" />
                    </div>
                )}
                <div className="flex gap-2">
                    <Button type="submit" size="lg" className="flex-1" id="saveTOTPBtn">
                        {msgStr("doSubmit")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button
                            type="submit"
                            variant="outline"
                            size="lg"
                            id="cancelTOTPBtn"
                            name="cancel-aia"
                            value="true"
                        >
                            {msgStr("doCancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
