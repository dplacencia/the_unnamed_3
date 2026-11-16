import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductsRecoveryPreview } from "./products-recovery";
const meta = {
  title: "Inventory/Products recovery",
  component: ProductsRecoveryPreview,
  args: { fixture: "exhausted" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Synthetic recovery and draft ownership preview. No API, persistent journal, real cross-tab lock or production guarantee. Ownership and browser capability states are predefined fixtures. Exact presentation is for visual review.",
      },
    },
  },
  render: (args) => <ProductsRecoveryPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof ProductsRecoveryPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Exhausted: Story = {};
export const LongProductName: Story = { args: { fixture: "long-name" } };
export const Automatic: Story = { args: { fixture: "automatic" } };
export const Restored: Story = { args: { fixture: "restored" } };
export const MemoryOnly: Story = { args: { fixture: "memory" } };
export const LocalStorage: Story = { args: { fixture: "localstorage" } };
export const UnavailableHistory: Story = { args: { fixture: "history" } };
export const ConfirmedStorageFailure: Story = {
  args: { fixture: "storage-failure" },
};
export const RecoveryElsewhere: Story = { args: { fixture: "elsewhere" } };
export const CoordinationUnavailable: Story = {
  args: { fixture: "uncoordinated" },
};
export const ActiveEditor: Story = { args: { fixture: "active" } };
export const UnreachableEditor: Story = { args: { fixture: "unreachable" } };
export const RestoredDraft: Story = { args: { fixture: "draft" } };
export const ChangedDraft: Story = { args: { fixture: "changed" } };
export const UnavailableCurrentData: Story = {
  args: { fixture: "current-unavailable" },
};
export const FormerEditor: Story = { args: { fixture: "former" } };
