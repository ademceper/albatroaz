import type { Meta, StoryObj } from "@storybook/react"
import { createKcPageStory } from "../KcPageStory"

const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" })

const meta = {
  title: "login/error.ftl",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <KcPageStory />,
}

export const WithCustomMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          summary: "An unexpected error has occurred. Please try again later.",
          type: "error",
        },
      }}
    />
  ),
}
