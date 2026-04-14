import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { Button } from "@albatroaz/ui/components/button"
import { Separator } from "@albatroaz/ui/components/separator"
import { SignInIcon } from "@phosphor-icons/react"
import type { ComponentType, SVGProps } from "react"
import {
  AppleLogo,
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  GitlabLogo,
  GoogleLogo,
  InstagramLogo,
  LinkedInLogo,
  MicrosoftLogo,
  TwitterLogo,
  XLogo,
} from "./BrandLogos"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"

type Social = NonNullable<Extract<KcContext, { pageId: "login.ftl" }>["social"]>

type Props = {
  social: Social | undefined
  realm: { password: boolean }
  i18n: I18n
}

type BrandIcon = ComponentType<SVGProps<SVGSVGElement>>

const providerIconMap: Record<string, BrandIcon> = {
  google: GoogleLogo,
  microsoft: MicrosoftLogo,
  github: GithubLogo,
  gitlab: GitlabLogo,
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  apple: AppleLogo,
  discord: DiscordLogo,
  twitter: TwitterLogo,
  x: XLogo,
  linkedin: LinkedInLogo,
  "linkedin-openid-connect": LinkedInLogo,
}

function ProviderIcon({
  alias,
  providerId,
}: {
  alias: string
  providerId: string
}) {
  const keys = [providerId, alias].filter(Boolean).map((k) => k.toLowerCase())
  for (const key of keys) {
    const Icon = providerIconMap[key]
    if (Icon) {
      return <Icon className="size-5 shrink-0" />
    }
  }
  return <SignInIcon className="size-5 shrink-0" />
}

export function SocialProviders({ social, realm, i18n }: Props) {
  const { msg } = i18n

  if (
    !realm.password ||
    social?.providers === undefined ||
    social.providers.length === 0
  ) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {social.providers.map((p) => (
          <Button
            key={p.alias}
            variant="outline"
            size="xl"
            asChild
            className="w-full justify-start gap-3"
          >
            <a href={p.loginUrl} id={`social-${p.alias}`}>
              <ProviderIcon alias={p.alias} providerId={p.providerId} />
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
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">
          {msg("identity-provider-login-label")}
        </span>
        <Separator className="flex-1" />
      </div>
    </div>
  )
}
