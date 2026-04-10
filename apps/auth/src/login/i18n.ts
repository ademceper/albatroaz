import { i18nBuilder } from "keycloakify/login"
import type { ThemeName } from "../kc.gen"
import { translations } from "./i18n/translations"

const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations(translations)
  .build()

type I18n = typeof ofTypeI18n

export { useI18n, type I18n }
