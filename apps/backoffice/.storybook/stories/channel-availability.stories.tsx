import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChannelAvailabilityPreview } from "./channel-availability-preview";

const meta = {
  title: "Backoffice/Channel Availability",
  component: ChannelAvailabilityPreview,
  args: { preset: "lookup" },
  argTypes: { preset: { control: false, table: { disable: true } } },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Check the channel-specific quantity for an exact product and stock location using synthetic owning responses. Recorded stock is a separate lookup.",
      },
    },
  },
  render: (args) => <ChannelAvailabilityPreview key={args.preset} {...args} />,
} satisfies Meta<typeof ChannelAvailabilityPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Lookup: Story = {};
export const Available: Story = { args: { preset: "available" } };
export const Zero: Story = { args: { preset: "zero" } };
export const Unavailable: Story = { args: { preset: "unavailable" } };
export const ReadFailure: Story = { args: { preset: "read-failure" } };
