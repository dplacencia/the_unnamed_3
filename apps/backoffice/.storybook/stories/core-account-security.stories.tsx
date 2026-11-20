import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CoreAccountSecurityPreview } from "./core-account-security";

const meta = {
  title: "Core/Account security",
  component: CoreAccountSecurityPreview,
  args: { fixture: "account" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Verified-email account recovery and the Owner's merchant MFA policy use synthetic status responses and hosted identity handoff examples.",
      },
    },
  },
  render: (args) => <CoreAccountSecurityPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof CoreAccountSecurityPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Account: Story = {};
export const RecoveryConfirmation: Story = {
  args: { fixture: "recovery-confirmation" },
};
export const RecoveryPending: Story = { args: { fixture: "recovery-pending" } };
export const RecoveryActionRequired: Story = {
  args: { fixture: "recovery-action-required" },
};
export const RecoverySupportRequired: Story = {
  args: { fixture: "recovery-support-required" },
};
export const RecoveryCompleted: Story = {
  args: { fixture: "recovery-completed" },
};
export const RecoveryStatusUnavailable: Story = {
  args: { fixture: "recovery-status-unavailable" },
};
export const RecoveryDeliveryUnknown: Story = {
  args: { fixture: "recovery-delivery-unknown" },
};
export const RecoveryCreationIncomplete: Story = {
  args: { fixture: "recovery-creation-incomplete" },
};
export const MerchantMfaPolicy: Story = {
  args: { fixture: "merchant-mfa-policy" },
};
export const MerchantMfaGrace: Story = {
  args: { fixture: "merchant-mfa-grace" },
};
export const MerchantMfaRequired: Story = {
  args: { fixture: "merchant-mfa-required" },
};
export const MerchantMfaUnconfirmed: Story = {
  args: { fixture: "merchant-mfa-unconfirmed" },
};
