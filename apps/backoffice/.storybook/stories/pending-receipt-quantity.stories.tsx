import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PendingResolutionPreview } from "./pending-resolution-preview";

const meta = {
  title: "Backoffice/Pending Receipt Quantity",
  component: PendingResolutionPreview,
  args: {
    preset: "review-receipt-release",
    focusedRelease: true,
    startInList: true,
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Open Pan de masa madre in Pendientes and review the quantity that arrived. The saved receipt was for 8 units. Enter a smaller positive quantity in multiples of 3 and confirm. The simulated reply supplies the independent stock effect.",
      },
    },
  },
  render: (args) => <PendingResolutionPreview key={args.preset} {...args} />,
} satisfies Meta<typeof PendingResolutionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flow: Story = {};
