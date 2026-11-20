import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  PendingMovementsBrowsingPreview,
  pendingBrowsingFixtures,
} from "./pending-movements-browsing-preview";

const meta = {
  title: "Backoffice/Pending Movements Browsing",
  component: PendingMovementsBrowsingPreview,
  args: { fixture: "standard", preset: "movements-entry" },
  argTypes: {
    fixture: { control: "select", options: [...pendingBrowsingFixtures] },
    preset: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Open Pendientes in Movimientos, choose a location or all accessible locations, and inspect a pending receipt or departure by its exact reference. The list, continuations, access and movement details are simulated.",
      },
    },
  },
  render: (args) => (
    <PendingMovementsBrowsingPreview
      key={`${args.preset}:${args.fixture}`}
      {...args}
    />
  ),
} satisfies Meta<typeof PendingMovementsBrowsingPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MovementsEntry: Story = {};
export const ChooseLocation: Story = { args: { preset: "choose-location" } };
export const InitialLoading: Story = { args: { preset: "initial-loading" } };
export const OneLocation: Story = { args: { preset: "one-location" } };
export const AllLocations: Story = { args: { preset: "all-locations" } };
export const SecondPage: Story = { args: { preset: "second-page" } };
export const PreviousResultsLoading: Story = {
  args: { preset: "previous-results-loading" },
};
export const TechnicalFailure: Story = {
  args: { preset: "technical-failure", fixture: "technical-failure" },
};
export const RejectedContinuation: Story = {
  args: { preset: "rejected-continuation", fixture: "rejected-continuation" },
};
export const EmptyContinuation: Story = {
  args: { preset: "empty-continuation", fixture: "empty-continuation" },
};
export const EmptyFirstPage: Story = { args: { preset: "empty-first-page" } };
export const AccessDenied: Story = {
  args: { preset: "access-denied", fixture: "access-denied" },
};
export const ReceiptInspection: Story = {
  args: { preset: "receipt-inspection" },
};
export const EmptyAfterInspection: Story = {
  args: { preset: "empty-after-inspection", fixture: "refresh-empty" },
};
export const DeparturePending: Story = {
  args: { preset: "departure-pending" },
};
export const DepartureApplied: Story = {
  args: { preset: "departure-applied", fixture: "departure-applied" },
};
export const DepartureRejected: Story = {
  args: { preset: "departure-rejected", fixture: "departure-rejected" },
};
export const DepartureLoading: Story = {
  args: { preset: "departure-loading", fixture: "departure-loading" },
};
export const DepartureUnavailable: Story = {
  args: { preset: "departure-unavailable", fixture: "departure-unavailable" },
};
export const DepartureReadError: Story = {
  args: { preset: "departure-read-error", fixture: "departure-error" },
};
