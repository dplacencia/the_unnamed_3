import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductLifecyclePreview } from "./product-lifecycle-preview";

const meta = {
  title: "Inventory/Product lifecycle",
  component: ProductLifecyclePreview,
  args: { fixture: "review" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review product archiving in the existing Products detail sheet. Outcomes are simulated.",
      },
    },
  },
  render: (args) => <ProductLifecyclePreview key={args.fixture} {...args} />,
} satisfies Meta<typeof ProductLifecyclePreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Review: Story = {};
export const Confirmation: Story = { args: { fixture: "confirmation" } };
export const Archived: Story = { args: { fixture: "archived" } };
export const Refused: Story = { args: { fixture: "refused" } };
export const Unconfirmed: Story = { args: { fixture: "unconfirmed" } };
