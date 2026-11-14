import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GridComparison } from "../stories/grid-comparison/comparison";
import { lazy, Suspense } from "react";

const NativeProbe = lazy(() =>
  import("../stories/grid-comparison/tabulator").then((module) => ({
    default: module.NativeTabulatorProbe,
  })),
);

const meta = {
  title: "Evaluation/Grid comparison",
  component: GridComparison,
  args: { candidate: "tanstack", size: 100 },
  argTypes: {
    candidate: { control: "radio", options: ["tanstack", "tabulator"] },
    size: { control: "select", options: [100, 1000, 10000] },
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Development-only library qualification with synthetic products and mocked save results. Note editing, inline expansion, probe controls and fixture storage are evaluation mechanisms, not selected product behavior. Production source and approved visual references are unchanged.",
      },
    },
  },
} satisfies Meta<typeof GridComparison>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TanStack: Story = {};
export const Tabulator: Story = { args: { candidate: "tabulator" } };
export const TabulatorNative: Story = {
  render: () => (
    <Suspense fallback={null}>
      <NativeProbe />
    </Suspense>
  ),
};
