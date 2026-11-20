import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CoreCapabilityEnablementPreview } from "./core-capability-enablement-preview";

const meta = {
  title: "Core/Capability enablement",
  component: CoreCapabilityEnablementPreview,
  args: { fixture: "explore" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review separate Catalogue and Stock enablement, the Pricing dependency example, and the distinction between current management authority and Inventory-provider availability. All results are synthetic.",
      },
    },
  },
  render: (args) => (
    <CoreCapabilityEnablementPreview key={args.fixture} {...args} />
  ),
} satisfies Meta<typeof CoreCapabilityEnablementPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Explore: Story = {};
export const PrerequisiteBlocked: Story = {
  args: { fixture: "prerequisite-blocked" },
};
export const DisableBlocked: Story = { args: { fixture: "disable-blocked" } };
export const ProviderUnavailable: Story = {
  args: { fixture: "provider-unavailable" },
};
export const ManagementUnavailable: Story = {
  args: { fixture: "management-unavailable" },
};
export const ReadOnly: Story = { args: { fixture: "read-only" } };
