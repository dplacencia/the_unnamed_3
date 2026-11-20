import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PendingResolutionPreview } from "./pending-resolution-preview";

const meta = {
  title: "Backoffice/Pending Release Guidance",
  component: PendingResolutionPreview,
  args: { preset: "review-release", focusedRelease: true, startInList: true },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Open the Manzana reineta departure in Pendientes, review its exact saved facts, and confirm the actual channel. The confirmed result reports the signed stock effect and returns to the same list scope. The fixtures also show unchanged recovery of an unconfirmed request.",
      },
    },
  },
  render: (args) => <PendingResolutionPreview key={args.preset} {...args} />,
} satisfies Meta<typeof PendingResolutionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flow: Story = {};
export const Unconfirmed: Story = {
  args: { preset: "unconfirmed", startInList: false },
};
