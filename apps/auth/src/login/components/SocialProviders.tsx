import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Button } from "@albatroaz/ui/components/button";
import { Separator } from "@albatroaz/ui/components/separator";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type Social = NonNullable<
    Extract<KcContext, { pageId: "login.ftl" }>["social"]
>;

type Props = {
    social: Social | undefined;
    realm: { password: boolean };
    i18n: I18n;
};

export function SocialProviders({ social, realm, i18n }: Props) {
    const { msg } = i18n;

    if (
        !realm.password ||
        social?.providers === undefined ||
        social.providers.length === 0
    ) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-xs">
                    {msg("identity-provider-login-label")}
                </span>
                <Separator className="flex-1" />
            </div>
            <div className="grid gap-2">
                {social.providers.map((p) => (
                    <Button
                        key={p.alias}
                        variant="outline"
                        size="lg"
                        asChild
                        className="w-full justify-center"
                    >
                        <a href={p.loginUrl} id={`social-${p.alias}`}>
                            {p.iconClasses && (
                                <i className={p.iconClasses} aria-hidden="true" />
                            )}
                            <span
                                // biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(p.displayName),
                                }}
                            />
                        </a>
                    </Button>
                ))}
            </div>
        </div>
    );
}
