import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PendingResolutionPreview } from "./pending-resolution-preview";

const meta = {
  title: "Backoffice/Pending Duplicate Review",
  component: PendingResolutionPreview,
  args: {
    preset: "select-counterpart",
    focusedDuplicate: true,
    startInList: true,
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Open Arroz largo in Pendientes to review the whole duplicate batch. Choose the authorized batch to keep, provide a cancellation reason and explicitly confirm. The synthetic result identifies both batches and supplies no stock effect.",
      },
    },
  },
  render: (args) => <PendingResolutionPreview key={args.preset} {...args} />,
} satisfies Meta<typeof PendingResolutionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flow: Story = {};
