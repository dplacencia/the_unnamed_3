import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductsCreationPreview } from "./products-creation-preview";

const meta = {
  title: "Inventory/Product creation",
  component: ProductsCreationPreview,
  args: { fixture: "catalogue" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Create a product from the Products workspace. These stories simulate one in-flight or unconfirmed creation at a time. Recovery uses virtual deadlines, and the restored and memory-only stories simulate storage capabilities. No real storage, API request or initial stock is involved.",
      },
    },
  },
  render: (args) => <ProductsCreationPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof ProductsCreationPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Catalogue: Story = {};
export const Recovery: Story = { args: { fixture: "recovery" } };
export const Restored: Story = { args: { fixture: "restored" } };
export const MemoryOnly: Story = { args: { fixture: "memory-only" } };
export const Rejected: Story = { args: { fixture: "rejected" } };
