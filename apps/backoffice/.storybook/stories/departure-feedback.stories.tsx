import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StockDeparturePreview } from "./stock-departure-preview";

const meta = {
  title: "Inventory/Departure feedback",
  component: StockDeparturePreview,
  args: { fixture: "applied", focusedFeedback: true },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Compare feedback for the same synthetic departure of 2250 g of Tomate pera from Sala de ventas via Mostrador. The applied result shows the signed stock effect. Pending, rejected and unconfirmed results keep their existing actions.",
      },
    },
  },
  render: (args) => (
    <StockDeparturePreview
      key={`${args.fixture}:${args.focusedFeedback}`}
      {...args}
    />
  ),
} satisfies Meta<typeof StockDeparturePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Applied: Story = {};
export const Pending: Story = { args: { fixture: "pending" } };
export const Rejected: Story = { args: { fixture: "rejected" } };
export const Unconfirmed: Story = { args: { fixture: "unconfirmed" } };
