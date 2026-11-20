import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MerchantInventoryAccess } from "./merchant-inventory-access";
import { NavigationPrototype } from "./navigation-prototype";

const meta = {
  title: "Core/Inventory trial access",
  component: MerchantInventoryAccess,
  parameters: { layout: "fullscreen", visual: { fullscreen: true } },
  args: { phase: "active", trialEndsAt: "2026-12-20T12:00:00Z" },
  render: (args) => (
    <NavigationPrototype
      initialPage="modules"
      permissionMode="ready"
      locationCount="one"
      modulesContent={
        <div className="w-full max-w-2xl">
          <MerchantInventoryAccess {...args} />
        </div>
      }
    />
  ),
} satisfies Meta<typeof MerchantInventoryAccess>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Active: Story = {};
export const Paused: Story = { args: { phase: "paused" } };
export const Unavailable: Story = { args: { phase: "unavailable" } };
