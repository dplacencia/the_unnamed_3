import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  PendingReceiptInspectionPreview,
  pendingInspectionFixtures,
} from "./pending-receipt-inspection-preview";

const meta = {
  title: "Inventory/Pending receipt inspection",
  component: PendingReceiptInspectionPreview,
  args: { fixture: "receipt" },
  argTypes: {
    fixture: { control: "select", options: [...pendingInspectionFixtures] },
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Record a receipt in Movimientos, then choose Ver detalles on its confirmed Pending result. The inspector simulates a fresh read of that exact line inside the existing panel, including a subsequent resolution, unavailable detail and a recoverable read error.",
      },
    },
  },
  render: (args) => (
    <PendingReceiptInspectionPreview key={args.fixture} {...args} />
  ),
} satisfies Meta<typeof PendingReceiptInspectionPreview>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Receipt: Story = {};
export const KnownQuantity: Story = { args: { fixture: "known-quantity" } };
export const KnownUnit: Story = { args: { fixture: "known-unit" } };
export const Applied: Story = { args: { fixture: "applied" } };
export const Rejected: Story = { args: { fixture: "rejected" } };
export const Loading: Story = { args: { fixture: "loading" } };
export const Unavailable: Story = { args: { fixture: "unavailable" } };
export const ReadError: Story = { args: { fixture: "read-error" } };
