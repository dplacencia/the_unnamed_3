import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StockLookupPreview } from "./stock-lookup-preview";

const meta = {
  title: "Inventory/Daily stock workflow",
  component: StockLookupPreview,
  args: {
    fixture: "from-receipt",
    dailyStock: { variant: "proposed", receipt: "movements" },
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Compare the current and proposed receipt journey with the same synthetic catalogue and stock. Search for Café molido (reference 000001), then use Movements in Current or the product details shortcut in Proposed. At Almacén, register 500 g and compare the receipt and the exact recorded balance of 2.5 kg.",
      },
    },
  },
  render: (args) => (
    <StockLookupPreview key={JSON.stringify(args.dailyStock)} {...args} />
  ),
} satisfies Meta<typeof StockLookupPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = {
  args: { dailyStock: { variant: "current", receipt: "movements" } },
};
export const Proposed: Story = {};
export const BalanceReadFailed: Story = {
  args: { dailyStock: { variant: "proposed", receipt: "read-error" } },
};
export const Pending: Story = {
  args: { dailyStock: { variant: "proposed", receipt: "pending" } },
};
