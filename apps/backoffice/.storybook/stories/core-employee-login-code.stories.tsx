import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmployeeLoginCodePreview } from "./core-employee-login-code-preview";

const meta = {
  title: "Backoffice/Core Employee Login Code",
  component: EmployeeLoginCodePreview,
  args: { preset: "unset" },
  argTypes: { preset: { control: false, table: { disable: true } } },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review the Owner’s employee sign-in code setup and change. Completion and conflicting code responses are synthetic.",
      },
    },
  },
  render: (args) => <EmployeeLoginCodePreview key={args.preset} {...args} />,
} satisfies Meta<typeof EmployeeLoginCodePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unset: Story = {};
export const Current: Story = { args: { preset: "current" } };
export const Conflict: Story = { args: { preset: "conflict" } };
