import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PendingResolutionPreview } from "./pending-resolution-preview";

const meta = {
  title: "Backoffice/Pending Resolution",
  component: PendingResolutionPreview,
  args: { preset: "review-release", denyRetry: false },
  argTypes: { preset: { control: false, table: { disable: true } } },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review a missing-channel departure, a never-arrived receipt or a wholly pending duplicate. The exact Pending lists, details, permissions, resolution attempts and retained outcomes are fixtures.",
      },
    },
  },
  render: (args) => <PendingResolutionPreview key={args.preset} {...args} />,
} satisfies Meta<typeof PendingResolutionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewRelease: Story = {};
export const ReviewRejection: Story = { args: { preset: "review-rejection" } };
export const ReviewDuplicate: Story = { args: { preset: "review-duplicate" } };
export const ReviewReceiptRelease: Story = {
  args: { preset: "review-receipt-release" },
};
export const SelectCounterpart: Story = {
  args: { preset: "select-counterpart" },
};
export const Unconfirmed: Story = { args: { preset: "unconfirmed" } };
export const RetainedApplied: Story = { args: { preset: "retained-applied" } };
export const CounterpartUnavailable: Story = {
  args: { preset: "counterpart-unavailable" },
};
