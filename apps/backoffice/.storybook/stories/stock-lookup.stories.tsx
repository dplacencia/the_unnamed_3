import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  StockLookupPreview,
  stockLookupFixtures,
} from "./stock-lookup-preview";

const meta = {
  title: "Inventory/Stock lookup",
  component: StockLookupPreview,
  args: { fixture: "lookup" },
  argTypes: {
    fixture: { control: "select", options: [...stockLookupFixtures] },
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Consultar existencias uses one exact product and location in the merchant workspace. Open the lookup directly, from product details, or from an applied receipt. The catalogue choices, access outcomes, recorded amounts and request timing are simulated.",
      },
    },
  },
  render: (args) => <StockLookupPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof StockLookupPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Lookup: Story = {};
export const FromProduct: Story = { args: { fixture: "from-product" } };
export const FromReceipt: Story = { args: { fixture: "from-receipt" } };
export const Loading: Story = { args: { fixture: "loading" } };
export const Refresh: Story = { args: { fixture: "refresh" } };
export const InitialFailure: Story = { args: { fixture: "initial-failure" } };
export const Denied: Story = { args: { fixture: "denied" } };
export const Invalid: Story = { args: { fixture: "invalid" } };
