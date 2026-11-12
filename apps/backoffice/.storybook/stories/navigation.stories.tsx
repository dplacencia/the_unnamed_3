import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavigationPrototype } from "./navigation-prototype";
import { destinations } from "./navigation-model";

const meta = {
  title: "Navigation/Merchant workspace",
  component: NavigationPrototype,
  args: {
    initialPage: "stock",
    permissionMode: "ready",
    locationCount: "several",
  },
  argTypes: {
    initialPage: { control: "select", options: destinations },
    permissionMode: {
      control: "select",
      options: ["ready", "restricted", "no-module", "loading", "error"],
    },
    locationCount: { control: "radio", options: ["one", "several"] },
  },
  render: (args) => (
    <NavigationPrototype
      key={`${args.initialPage}:${args.permissionMode}:${args.locationCount}`}
      {...args}
    />
  ),
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Development-only navigation preview. Permissions, locations and retry outcomes are simulated. No business data, production destinations or stock-changing actions. Visual candidates require explicit approval.",
      },
    },
  },
} satisfies Meta<typeof NavigationPrototype>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Workspace: Story = {};
export const Products: Story = { args: { initialPage: "products" } };
export const Restricted: Story = { args: { permissionMode: "restricted" } };
export const NoModuleAccess: Story = {
  args: { initialPage: "home", permissionMode: "no-module" },
};
export const PermissionLoading: Story = { args: { permissionMode: "loading" } };
export const PermissionError: Story = { args: { permissionMode: "error" } };
export const SoleLocation: Story = { args: { locationCount: "one" } };
