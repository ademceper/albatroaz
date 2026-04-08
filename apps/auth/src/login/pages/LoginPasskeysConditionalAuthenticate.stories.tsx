import type { Meta, StoryObj } from "@storybook/react"
import { createKcPageStory } from "../KcPageStory"

const { KcPageStory } = createKcPageStory({
  pageId: "login-passkeys-conditional-authenticate.ftl",
})

const meta = {
  title: "login/login-passkeys-conditional-authenticate.ftl",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <KcPageStory /> }

export const Arabic: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "ar" } }} />
  ),
}

export const Catalan: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "ca" } }} />
  ),
}

export const Czech: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "cs" } }} />
  ),
}

export const Danish: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "da" } }} />
  ),
}

export const German: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "de" } }} />
  ),
}

export const Greek: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "el" } }} />
  ),
}

export const Spanish: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "es" } }} />
  ),
}

export const Persian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "fa" } }} />
  ),
}

export const Finnish: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "fi" } }} />
  ),
}

export const French: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "fr" } }} />
  ),
}

export const Hungarian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "hu" } }} />
  ),
}

export const Italian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "it" } }} />
  ),
}

export const Japanese: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "ja" } }} />
  ),
}

export const Georgian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "ka" } }} />
  ),
}

export const Lithuanian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "lt" } }} />
  ),
}

export const Latvian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "lv" } }} />
  ),
}

export const Dutch: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "nl" } }} />
  ),
}

export const Norwegian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "no" } }} />
  ),
}

export const Polish: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "pl" } }} />
  ),
}

export const PortugueseBrazil: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "pt-BR" } }} />
  ),
}

export const Portuguese: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "pt" } }} />
  ),
}

export const Russian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "ru" } }} />
  ),
}

export const Slovak: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "sk" } }} />
  ),
}

export const Swedish: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "sv" } }} />
  ),
}

export const Thai: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "th" } }} />
  ),
}

export const Turkish: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "tr" } }} />
  ),
}

export const Ukrainian: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "uk" } }} />
  ),
}

export const ChineseSimplified: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "zh-CN" } }} />
  ),
}

export const ChineseTraditional: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "zh-TW" } }} />
  ),
}
