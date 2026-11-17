import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StockReceiptPreview } from "./stock-receipt-preview";

const meta = {
  title: "Inventory/First stock receipt",
  component: StockReceiptPreview,
  args: { fixture: "movements" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Simulated single-product receipt. The Movements story starts with a blank draft. From Product starts in the creation workspace and exposes a shortcut after confirmed creation. Separate fixtures show the balance lookup, receipt outcomes and recovery. Timing, storage capabilities and the ledger are synthetic.",
      },
    },
  },
  render: (args) => <StockReceiptPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof StockReceiptPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Movements: Story = {};
export const FromProduct: Story = { args: { fixture: "from-product" } };
export const ReadError: Story = { args: { fixture: "read-error" } };
export const ReadDenied: Story = { args: { fixture: "read-denied" } };
export const Pending: Story = { args: { fixture: "pending" } };
export const Rejected: Story = { args: { fixture: "rejected" } };
export const Recovery: Story = { args: { fixture: "recovery" } };
export const Restored: Story = { args: { fixture: "restored" } };
export const MemoryOnly: Story = { args: { fixture: "memory-only" } };
