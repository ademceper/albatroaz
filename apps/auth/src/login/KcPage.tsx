import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import Template from "keycloakify/login/Template";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Code = lazy(() => import("keycloakify/login/pages/Code"));
const DeleteAccountConfirm = lazy(
    () => import("keycloakify/login/pages/DeleteAccountConfirm")
);
const DeleteCredential = lazy(() => import("keycloakify/login/pages/DeleteCredential"));
const ErrorPage = lazy(() => import("keycloakify/login/pages/Error"));
const FrontchannelLogout = lazy(
    () => import("keycloakify/login/pages/FrontchannelLogout")
);
const IdpReviewUserProfile = lazy(
    () => import("keycloakify/login/pages/IdpReviewUserProfile")
);
const Info = lazy(() => import("keycloakify/login/pages/Info"));
const LinkIdpAction = lazy(() => import("keycloakify/login/pages/LinkIdpAction"));
const Login = lazy(() => import("keycloakify/login/pages/Login"));
const LoginConfigTotp = lazy(() => import("keycloakify/login/pages/LoginConfigTotp"));
const LoginIdpLinkConfirm = lazy(
    () => import("keycloakify/login/pages/LoginIdpLinkConfirm")
);
const LoginIdpLinkConfirmOverride = lazy(
    () => import("keycloakify/login/pages/LoginIdpLinkConfirmOverride")
);
const LoginIdpLinkEmail = lazy(
    () => import("keycloakify/login/pages/LoginIdpLinkEmail")
);
const LoginOauth2DeviceVerifyUserCode = lazy(
    () => import("keycloakify/login/pages/LoginOauth2DeviceVerifyUserCode")
);
const LoginOauthGrant = lazy(() => import("keycloakify/login/pages/LoginOauthGrant"));
const LoginOtp = lazy(() => import("keycloakify/login/pages/LoginOtp"));
const LoginPageExpired = lazy(() => import("keycloakify/login/pages/LoginPageExpired"));
const LoginPasskeysConditionalAuthenticate = lazy(
    () => import("keycloakify/login/pages/LoginPasskeysConditionalAuthenticate")
);
const LoginPassword = lazy(() => import("keycloakify/login/pages/LoginPassword"));
const LoginRecoveryAuthnCodeConfig = lazy(
    () => import("keycloakify/login/pages/LoginRecoveryAuthnCodeConfig")
);
const LoginRecoveryAuthnCodeInput = lazy(
    () => import("keycloakify/login/pages/LoginRecoveryAuthnCodeInput")
);
const LoginResetOtp = lazy(() => import("keycloakify/login/pages/LoginResetOtp"));
const LoginResetPassword = lazy(
    () => import("keycloakify/login/pages/LoginResetPassword")
);
const LoginUpdatePassword = lazy(
    () => import("keycloakify/login/pages/LoginUpdatePassword")
);
const LoginUpdateProfile = lazy(
    () => import("keycloakify/login/pages/LoginUpdateProfile")
);
const LoginUsername = lazy(() => import("keycloakify/login/pages/LoginUsername"));
const LoginVerifyEmail = lazy(() => import("keycloakify/login/pages/LoginVerifyEmail"));
const LoginX509Info = lazy(() => import("keycloakify/login/pages/LoginX509Info"));
const LogoutConfirm = lazy(() => import("keycloakify/login/pages/LogoutConfirm"));
const Register = lazy(() => import("keycloakify/login/pages/Register"));
const SamlPostForm = lazy(() => import("keycloakify/login/pages/SamlPostForm"));
const SelectAuthenticator = lazy(
    () => import("keycloakify/login/pages/SelectAuthenticator")
);
const SelectOrganization = lazy(
    () => import("keycloakify/login/pages/SelectOrganization")
);
const Terms = lazy(() => import("keycloakify/login/pages/Terms"));
const UpdateEmail = lazy(() => import("keycloakify/login/pages/UpdateEmail"));
const WebauthnAuthenticate = lazy(
    () => import("keycloakify/login/pages/WebauthnAuthenticate")
);
const WebauthnError = lazy(() => import("keycloakify/login/pages/WebauthnError"));
const WebauthnRegister = lazy(
    () => import("keycloakify/login/pages/WebauthnRegister")
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
