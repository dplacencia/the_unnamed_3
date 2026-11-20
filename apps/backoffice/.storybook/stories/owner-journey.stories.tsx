import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OwnerJourneyPreview } from "./owner-journey-preview";

const meta = {
  title: "Core/Owner journey",
  component: OwnerJourneyPreview,
  args: { fixture: "first-visit" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Walk through one selected merchant from Core setup to first stock. This review shares synthetic data between the views.",
      },
    },
  },
  render: (args) => <OwnerJourneyPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof OwnerJourneyPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BusinessSelection: Story = {
  args: { fixture: "business-selection" },
};
export const NewBusiness: Story = { args: { fixture: "new-business" } };
export const FirstVisit: Story = {};
export const ReadyToReceive: Story = { args: { fixture: "ready-to-receive" } };
export const RecordedStock: Story = { args: { fixture: "recorded-stock" } };
export const TrialPaused: Story = { args: { fixture: "trial-paused" } };
export const AccessUnavailable: Story = {
  args: { fixture: "access-unavailable" },
};
