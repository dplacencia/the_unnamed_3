import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PendingReceiptInspectionPreview } from "./pending-receipt-inspection-preview";
import { StockReceiptPreview } from "./stock-receipt-preview";

type Comparison = "current" | "pending" | "unconfirmed" | "balance-read-failed";

function ReceiptFeedbackPreview({ comparison }: { comparison: Comparison }) {
  if (comparison === "current" || comparison === "pending") {
    return (
      <PendingReceiptInspectionPreview
        fixture="refresh"
        focusedFeedback={comparison === "pending"}
      />
    );
  }
  return (
    <StockReceiptPreview
      fixture={comparison === "unconfirmed" ? "recovery" : "read-error"}
      focusedFeedback
    />
  );
}

const meta = {
  title: "Inventory/Receipt feedback",
  component: ReceiptFeedbackPreview,
  args: { comparison: "pending" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Compare the recorded Pending result, the exact current state, unconfirmed receipt recovery and a failed balance lookup. Use Tomate pera, Trastienda and 500 g in each story. All outcomes are synthetic.",
      },
    },
  },
  render: (args) => <ReceiptFeedbackPreview key={args.comparison} {...args} />,
} satisfies Meta<typeof ReceiptFeedbackPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = { args: { comparison: "current" } };
export const Pending: Story = {};
export const Unconfirmed: Story = { args: { comparison: "unconfirmed" } };
export const BalanceReadFailed: Story = {
  args: { comparison: "balance-read-failed" },
};
