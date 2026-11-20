import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CoreHierarchyPreview,
  coreHierarchyFixtures,
} from "./core-hierarchy-preview";

const meta = {
  title: "Core/Sites and Areas",
  component: CoreHierarchyPreview,
  args: { fixture: "overview" },
  argTypes: {
    fixture: { control: "select", options: [...coreHierarchyFixtures] },
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review Core Sites and Areas, editing and lifecycle. The owning-module checks and Core results are simulated.",
      },
    },
  },
  render: (args) => <CoreHierarchyPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof CoreHierarchyPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const NewSite: Story = { args: { fixture: "new-site" } };
export const ScopedAreas: Story = { args: { fixture: "scoped-areas" } };
export const ArchiveUnavailable: Story = {
  args: { fixture: "archive-unavailable" },
};
export const ArchiveInUse: Story = { args: { fixture: "archive-in-use" } };
export const RestoreSite: Story = { args: { fixture: "restore-site" } };
export const ReadLoading: Story = { args: { fixture: "read-loading" } };
export const ReadError: Story = { args: { fixture: "read-error" } };
export const Empty: Story = { args: { fixture: "empty" } };
export const ArchiveFilter: Story = { args: { fixture: "archive-filter" } };
export const ReferenceBlocked: Story = {
  args: { fixture: "reference-blocked" },
};
export const UnconfirmedCreate: Story = {
  args: { fixture: "unconfirmed-create" },
};
