import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StockDeparturePreview } from "./stock-departure-preview";

const meta = {
  title: "Inventory/First stock departure",
  component: StockDeparturePreview,
  args: { fixture: "movements" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Simulated single-product departure. Choose an explicit origin, channel and exact quantity. Fixtures show a blank entry, an origin with no enabled channels, confirmed results and same-command recovery. No runtime requests or storage are used.",
      },
    },
  },
  render: (args) => <StockDeparturePreview key={args.fixture} {...args} />,
} satisfies Meta<typeof StockDeparturePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Movements: Story = {};
export const OriginWithoutChannels: Story = {
  args: { fixture: "origin-without-channels" },
};
export const Applied: Story = { args: { fixture: "applied" } };
export const Pending: Story = { args: { fixture: "pending" } };
export const Rejected: Story = { args: { fixture: "rejected" } };
export const Unconfirmed: Story = { args: { fixture: "unconfirmed" } };
