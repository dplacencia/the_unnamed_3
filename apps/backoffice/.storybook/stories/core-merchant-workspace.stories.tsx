import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CoreMerchantWorkspace } from "./core-merchant-workspace";

const meta = {
  title: "Core/Merchant workspace",
  component: CoreMerchantWorkspace,
  args: { fixture: "sign-in" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review the identity handoff, business choices, creation and creator readiness through synthetic Core responses.",
      },
    },
  },
  render: (args) => <CoreMerchantWorkspace key={args.fixture} {...args} />,
} satisfies Meta<typeof CoreMerchantWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;
export const SignIn: Story = {};
export const SignupHandoff: Story = { args: { fixture: "signup-handoff" } };
export const SessionChecking: Story = { args: { fixture: "session-checking" } };
export const SessionUnavailable: Story = {
  args: { fixture: "session-unavailable" },
};
export const EmailVerification: Story = {
  args: { fixture: "email-verification" },
};
export const BusinessList: Story = { args: { fixture: "business-list" } };
export const BusinessListEmpty: Story = {
  args: { fixture: "business-list-empty" },
};
export const BusinessListUnavailable: Story = {
  args: { fixture: "business-list-unavailable" },
};
export const NewBusiness: Story = { args: { fixture: "new-business" } };
export const NewBusinessWithCreatorNames: Story = {
  args: { fixture: "new-business-with-creator-names" },
};
export const CreationPending: Story = { args: { fixture: "creation-pending" } };
export const CreationDelayed: Story = { args: { fixture: "creation-delayed" } };
export const CreationBlocked: Story = { args: { fixture: "creation-blocked" } };
export const CreationUnconfirmed: Story = {
  args: { fixture: "creation-unconfirmed" },
};
export const CreationReady: Story = { args: { fixture: "creation-ready" } };
export const Workspace: Story = { args: { fixture: "workspace" } };
