import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CoreEmployeeAccountsPreview,
  employeeFixtures,
} from "./core-employee-accounts-preview";

const meta = {
  title: "Core/Employee accounts",
  component: CoreEmployeeAccountsPreview,
  args: { fixture: "overview" },
  argTypes: { fixture: { control: "select", options: [...employeeFixtures] } },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review employee-account provision, Site and Area association, and account lifecycle with simulated Core outcomes and synthetic credentials.",
      },
    },
  },
  render: (args) => (
    <CoreEmployeeAccountsPreview key={args.fixture} {...args} />
  ),
} satisfies Meta<typeof CoreEmployeeAccountsPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const NewEmployee: Story = { args: { fixture: "new-employee" } };
export const TemporaryPassword: Story = {
  args: { fixture: "temporary-password" },
};
export const MoveLocation: Story = { args: { fixture: "move-location" } };
export const Disable: Story = { args: { fixture: "disable" } };
export const ProviderUnavailable: Story = {
  args: { fixture: "provider-unavailable" },
};
export const DisableUnconfirmed: Story = {
  args: { fixture: "disable-unconfirmed" },
};
export const Reactivate: Story = { args: { fixture: "reactivate" } };
export const Delegated: Story = { args: { fixture: "delegated" } };
export const ReactivateDenied: Story = {
  args: { fixture: "reactivate-denied" },
};
