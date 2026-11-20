import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InventorySetupPreview } from "./inventory-setup-preview";

const meta = {
  title: "Backoffice/Inventory Setup",
  component: InventorySetupPreview,
  args: { preset: "overview" },
  argTypes: { preset: { control: false, table: { disable: true } } },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review Core Area links, configure a stock location and explicitly enable channels in location order. All reads and outcomes are fixtures.",
      },
    },
  },
  render: (args) => <InventorySetupPreview key={args.preset} {...args} />,
} satisfies Meta<typeof InventorySetupPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const StockLocation: Story = { args: { preset: "stock-location" } };
export const ScheduledCalendar: Story = {
  args: { preset: "scheduled-calendar" },
};
export const CreateChannel: Story = { args: { preset: "create-channel" } };
export const EnableChannel: Story = { args: { preset: "enable-channel" } };
export const Unavailable: Story = { args: { preset: "unavailable" } };
export const Unconfirmed: Story = { args: { preset: "unconfirmed" } };
