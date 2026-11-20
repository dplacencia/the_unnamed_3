import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OwnerJourneyPreview } from "./owner-journey-preview";

const meta = {
  title: "Core/First-use guidance",
  component: OwnerJourneyPreview,
  args: { fixture: "first-visit", guidance: true },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Compare the current Owner home with one contextual next action. The scenarios use confirmed synthetic Site and Area data and keep the existing setup forms.",
      },
    },
  },
  render: (args) => (
    <OwnerJourneyPreview key={`${args.fixture}:${args.guidance}`} {...args} />
  ),
} satisfies Meta<typeof OwnerJourneyPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = { args: { guidance: false } };
export const FirstVisit: Story = {};
export const OneArea: Story = { args: { fixture: "one-area" } };
export const ChooseArea: Story = { args: { fixture: "choose-area" } };
export const NoActiveArea: Story = { args: { fixture: "no-active-area" } };
export const TrialPaused: Story = { args: { fixture: "trial-paused" } };
export const AccessUnavailable: Story = {
  args: { fixture: "access-unavailable" },
};
