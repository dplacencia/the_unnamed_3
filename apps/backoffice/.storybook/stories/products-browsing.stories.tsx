import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductsTablePreview } from "./products-table-preview";
import { ProductsRecoveryPreview } from "./products-recovery";

const meta = {
  title: "Inventory/Products Browsing",
  component: ProductsTablePreview,
  args: {
    initialStock: false,
    initialDensity: "compact",
    hiddenColumns: false,
    locationCount: "several",
    archivedFixture: true,
    saveFixture: "confirmed",
    browsingFixture: "catalogue",
    browsingCount: 1000,
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Simulated Products browsing with 1,000 deterministic records. Existing demo search and sorting are not production policies; Inventory does not expose a Products search/pagination API. Only the displayed group is rendered, with full editor state retained across groups. Reads, positions, estimates and failures are fixture-controlled; no real API, business writes, production persistence or capacity guarantee. Large Catalogue uses 10,000 records only to check bounded product DOM rows. Delayed resolves new searches faster than earlier page reads to exercise stale-result protection. Loading and Previous Results deliberately hold a read pending. Read Error fails once and Retry succeeds; Next Read Error fails one later page read. Unusable Position requires an explicit restart. Exact visuals require specific review before reference promotion.",
      },
    },
  },
  render: (args) => (
    <ProductsTablePreview
      key={`${args.browsingFixture}:${args.browsingCount}:${args.initialStock}:${args.initialDensity}:${args.hiddenColumns}:${args.locationCount}:${args.archivedFixture}:${args.saveFixture}`}
      {...args}
    />
  ),
} satisfies Meta<typeof ProductsTablePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Catalogue: Story = {};
export const LargeCatalogue: Story = { args: { browsingCount: 10_000 } };
export const StockContext: Story = { args: { initialStock: true } };
export const Delayed: Story = { args: { browsingFixture: "delayed" } };
export const Loading: Story = { args: { browsingFixture: "loading" } };
export const PreviousResults: Story = {
  args: { browsingFixture: "loading-next" },
};
export const ReadError: Story = { args: { browsingFixture: "read-error" } };
export const NextReadError: Story = {
  args: { browsingFixture: "next-read-error" },
};
export const UnusablePosition: Story = {
  args: { browsingFixture: "unusable-position" },
};
export const WithoutEstimate: Story = {
  args: { browsingFixture: "without-estimate" },
};
export const ZeroEstimate: Story = {
  args: { browsingFixture: "zero-estimate", browsingCount: 0 },
};
export const ShortPage: Story = { args: { browsingFixture: "short-page" } };
export const EditingMixed: Story = { args: { saveFixture: "mixed" } };
export const RecoveryNextError: Story = {
  render: () => (
    <ProductsRecoveryPreview
      fixture="exhausted"
      browsingFixture="next-read-error"
      browsingCount={1000}
    />
  ),
};
