import type { Meta, StoryObj } from "@storybook/react"
import { createKcPageStory } from "../KcPageStory"

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" })

const meta = {
  title: "login/register.ftl",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <KcPageStory />,
}

export const WithEmailAlreadyExists: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        profile: {
          attributesByName: {
            email: { value: "max.mustermann@mail.com" },
          },
        },
        messagesPerField: {
          existsError: (fieldName: string, ...otherFieldNames: string[]) => {
            const fieldNames = [fieldName, ...otherFieldNames]
            return fieldNames.includes("email")
          },
          get: (fieldName: string) =>
            fieldName === "email" ? "Email already exists." : "",
        },
      }}
    />
  ),
}

export const WithRecaptcha: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        scripts: ["https://www.google.com/recaptcha/api.js"],
        recaptchaRequired: true,
        recaptchaSiteKey: "6LcFEAkTAAAAAEKTYufJSWMz5JrM5XDuRueDUMUf",
      }}
    />
  ),
}

export const WithPasswordPolicies: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        passwordPolicies: {
          length: 8,
          digits: 2,
          lowerCase: 1,
          upperCase: 1,
          specialChars: 1,
          notUsername: true,
          notEmail: true,
        },
      }}
    />
  ),
}

export const French: Story = {
  render: () => (
    <KcPageStory kcContext={{ locale: { currentLanguageTag: "fr" } }} />
  ),
}
