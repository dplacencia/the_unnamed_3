import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CommitmentScopePreview,
  HoldSettingsPreview,
} from "./stock-commitment-setup-preview";
import { StockCommitmentsPreview } from "./stock-commitments-preview";

const meta = {
  title: "Inventory/Stock commitments",
  component: StockCommitmentsPreview,
  args: { fixture: "reserve" },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Synthetic JNY-019–021 preview. The fixed backed-reservation example accepts three units, with a four-unit request exercising explicit partial acceptance. Try delivering all three, or one unit with an explicit remainder choice. All exact stock and commitment facts come from fixture responses. Current native and browser APIs do not serve commitments.",
      },
    },
  },
  render: (args) => <StockCommitmentsPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof StockCommitmentsPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reserve: Story = {};
export const Active: Story = { args: { fixture: "active" } };
export const PartialReservation: Story = {
  args: { fixture: "partial-reservation" },
};
export const Release: Story = { args: { fixture: "release" } };
export const Fulfill: Story = { args: { fixture: "fulfill" } };
export const PartialFulfillment: Story = {
  args: { fixture: "partial-fulfillment" },
};
export const Fulfilled: Story = { args: { fixture: "fulfilled" } };
export const Unconfirmed: Story = { args: { fixture: "unconfirmed" } };
export const ReadUnavailable: Story = { args: { fixture: "read-unavailable" } };

export const Released: Story = { args: { fixture: "released" } };
export const ReadError: Story = { args: { fixture: "read-error" } };
export const SelectScope: Story = { render: () => <CommitmentScopePreview /> };
export const HoldSettings: Story = { render: () => <HoldSettingsPreview /> };
