import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "info.ftl" });

const meta = {
    title: "login/info.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messageHeader: "Information",
                message: {
                    summary: "This is an informational message.",
                    type: "info"
                }
            }}
        />
    )
};

export const WithLinkBack: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                actionUri: undefined,
                messageHeader: "Verify your email",
                message: {
                    summary: "We have sent you a verification link.",
                    type: "info"
                }
            }}
        />
    )
};
