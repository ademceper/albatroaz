import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-password.ftl" });

const meta = {
    title: "login/login-password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <KcPageStory /> };

export const WithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return fieldNames.includes("password");
                    },
                    get: (fieldName: string) =>
                        fieldName === "password" ? "Invalid password." : ""
                }
            }}
        />
    )
};

export const French: Story = {
    render: () => <KcPageStory kcContext={{ locale: { currentLanguageTag: "fr" } }} />
};
