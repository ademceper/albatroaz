import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import Template from "./Template";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Code = lazy(() => import("./pages/Code"));
const DeleteAccountConfirm = lazy(
    () => import("./pages/DeleteAccountConfirm")
);
const DeleteCredential = lazy(() => import("./pages/DeleteCredential"));
const ErrorPage = lazy(() => import("./pages/Error"));
const FrontchannelLogout = lazy(
    () => import("./pages/FrontchannelLogout")
);
const IdpReviewUserProfile = lazy(
    () => import("./pages/IdpReviewUserProfile")
);
const Info = lazy(() => import("./pages/Info"));
const LinkIdpAction = lazy(() => import("./pages/LinkIdpAction"));
const Login = lazy(() => import("./pages/Login"));
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));
const LoginIdpLinkConfirm = lazy(
    () => import("./pages/LoginIdpLinkConfirm")
);
const LoginIdpLinkConfirmOverride = lazy(
    () => import("./pages/LoginIdpLinkConfirmOverride")
);
const LoginIdpLinkEmail = lazy(
    () => import("./pages/LoginIdpLinkEmail")
);
const LoginOauth2DeviceVerifyUserCode = lazy(
    () => import("./pages/LoginOauth2DeviceVerifyUserCode")
);
const LoginOauthGrant = lazy(() => import("./pages/LoginOauthGrant"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"));
const LoginPasskeysConditionalAuthenticate = lazy(
    () => import("./pages/LoginPasskeysConditionalAuthenticate")
);
const LoginPassword = lazy(() => import("./pages/LoginPassword"));
const LoginRecoveryAuthnCodeConfig = lazy(
    () => import("./pages/LoginRecoveryAuthnCodeConfig")
);
const LoginRecoveryAuthnCodeInput = lazy(
    () => import("./pages/LoginRecoveryAuthnCodeInput")
);
const LoginResetOtp = lazy(() => import("./pages/LoginResetOtp"));
const LoginResetPassword = lazy(
    () => import("./pages/LoginResetPassword")
);
const LoginUpdatePassword = lazy(
    () => import("./pages/LoginUpdatePassword")
);
const LoginUpdateProfile = lazy(
    () => import("./pages/LoginUpdateProfile")
);
const LoginUsername = lazy(() => import("./pages/LoginUsername"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const LoginX509Info = lazy(() => import("./pages/LoginX509Info"));
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"));
const Register = lazy(() => import("./pages/Register"));
const SamlPostForm = lazy(() => import("./pages/SamlPostForm"));
const SelectAuthenticator = lazy(
    () => import("./pages/SelectAuthenticator")
);
const SelectOrganization = lazy(
    () => import("./pages/SelectOrganization")
);
const Terms = lazy(() => import("./pages/Terms"));
const UpdateEmail = lazy(() => import("./pages/UpdateEmail"));
const WebauthnAuthenticate = lazy(
    () => import("./pages/WebauthnAuthenticate")
);
const WebauthnError = lazy(() => import("./pages/WebauthnError"));
const WebauthnRegister = lazy(
    () => import("./pages/WebauthnRegister")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const common = { i18n, classes, Template, doUseDefaultCss: true } as const;

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "code.ftl":
                        return <Code {...common} kcContext={kcContext} />;
                    case "delete-account-confirm.ftl":
                        return <DeleteAccountConfirm {...common} kcContext={kcContext} />;
                    case "delete-credential.ftl":
                        return <DeleteCredential {...common} kcContext={kcContext} />;
                    case "error.ftl":
                        return <ErrorPage {...common} kcContext={kcContext} />;
                    case "frontchannel-logout.ftl":
                        return <FrontchannelLogout {...common} kcContext={kcContext} />;
                    case "idp-review-user-profile.ftl":
                        return (
                            <IdpReviewUserProfile
                                {...common}
                                kcContext={kcContext}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "info.ftl":
                        return <Info {...common} kcContext={kcContext} />;
                    case "link-idp-action.ftl":
                        return <LinkIdpAction {...common} kcContext={kcContext} />;
                    case "login.ftl":
                        return <Login {...common} kcContext={kcContext} />;
                    case "login-config-totp.ftl":
                        return <LoginConfigTotp {...common} kcContext={kcContext} />;
                    case "login-idp-link-confirm.ftl":
                        return <LoginIdpLinkConfirm {...common} kcContext={kcContext} />;
                    case "login-idp-link-confirm-override.ftl":
                        return (
                            <LoginIdpLinkConfirmOverride
                                {...common}
                                kcContext={kcContext}
                            />
                        );
                    case "login-idp-link-email.ftl":
                        return <LoginIdpLinkEmail {...common} kcContext={kcContext} />;
                    case "login-oauth2-device-verify-user-code.ftl":
                        return (
                            <LoginOauth2DeviceVerifyUserCode
                                {...common}
                                kcContext={kcContext}
                            />
                        );
                    case "login-oauth-grant.ftl":
                        return <LoginOauthGrant {...common} kcContext={kcContext} />;
                    case "login-otp.ftl":
                        return <LoginOtp {...common} kcContext={kcContext} />;
                    case "login-page-expired.ftl":
                        return <LoginPageExpired {...common} kcContext={kcContext} />;
                    case "login-passkeys-conditional-authenticate.ftl":
                        return (
                            <LoginPasskeysConditionalAuthenticate
                                {...common}
                                kcContext={kcContext}
                            />
                        );
                    case "login-password.ftl":
                        return <LoginPassword {...common} kcContext={kcContext} />;
                    case "login-recovery-authn-code-config.ftl":
                        return (
                            <LoginRecoveryAuthnCodeConfig
                                {...common}
                                kcContext={kcContext}
                            />
                        );
                    case "login-recovery-authn-code-input.ftl":
                        return (
                            <LoginRecoveryAuthnCodeInput
                                {...common}
                                kcContext={kcContext}
                            />
                        );
                    case "login-reset-otp.ftl":
                        return <LoginResetOtp {...common} kcContext={kcContext} />;
                    case "login-reset-password.ftl":
                        return <LoginResetPassword {...common} kcContext={kcContext} />;
                    case "login-update-password.ftl":
                        return <LoginUpdatePassword {...common} kcContext={kcContext} />;
                    case "login-update-profile.ftl":
                        return (
                            <LoginUpdateProfile
                                {...common}
                                kcContext={kcContext}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-username.ftl":
                        return <LoginUsername {...common} kcContext={kcContext} />;
                    case "login-verify-email.ftl":
                        return <LoginVerifyEmail {...common} kcContext={kcContext} />;
                    case "login-x509-info.ftl":
                        return <LoginX509Info {...common} kcContext={kcContext} />;
                    case "logout-confirm.ftl":
                        return <LogoutConfirm {...common} kcContext={kcContext} />;
                    case "register.ftl":
                        return (
                            <Register
                                {...common}
                                kcContext={kcContext}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "saml-post-form.ftl":
                        return <SamlPostForm {...common} kcContext={kcContext} />;
                    case "select-authenticator.ftl":
                        return <SelectAuthenticator {...common} kcContext={kcContext} />;
                    case "select-organization.ftl":
                        return <SelectOrganization {...common} kcContext={kcContext} />;
                    case "terms.ftl":
                        return <Terms {...common} kcContext={kcContext} />;
                    case "update-email.ftl":
                        return (
                            <UpdateEmail
                                {...common}
                                kcContext={kcContext}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "webauthn-authenticate.ftl":
                        return <WebauthnAuthenticate {...common} kcContext={kcContext} />;
                    case "webauthn-error.ftl":
                        return <WebauthnError {...common} kcContext={kcContext} />;
                    case "webauthn-register.ftl":
                        return <WebauthnRegister {...common} kcContext={kcContext} />;
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
