import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductsTablePreview } from "./products-table-preview";

const meta = {
  title: "Inventory/Products",
  component: ProductsTablePreview,
  args: {
    initialStock: false,
    initialDensity: "compact",
    hiddenColumns: false,
    locationCount: "several",
    archivedFixture: false,
    saveFixture: "confirmed",
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Browsing and first editing design with TanStack Table and TailAdmin. Records and save outcomes are synthetic; no API or business writes. Editar opens the panel editor; Editar tabla enables repeated drafts. Existing SKUs, units, barcodes and stock stay read-only. All drafts must pass local checks before a simulated save. Mixed confirms the first requested field and rejects the rest, exposing field-level partial outcomes. Unconfirmed is the earlier first-editor fixture: it retains drafts and pauses further submission until reset. The separate Products recovery catalogue demonstrates the subsequently selected recovery/ownership design through simulations; production mechanisms remain undefined. In-app departure uses the selected save/discard/keep-editing guard; browser closing/reload is not covered. Exact widget treatment remains a review proposal. No image is accepted automatically.",
      },
    },
  },
  render: (args) => (
    <ProductsTablePreview
      key={`${args.initialStock}:${args.initialDensity}:${args.hiddenColumns}:${args.locationCount}:${args.archivedFixture}:${args.saveFixture}`}
      {...args}
    />
  ),
} satisfies Meta<typeof ProductsTablePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Catalogue: Story = {};
export const StockContext: Story = { args: { initialStock: true } };
export const Comfortable: Story = { args: { initialDensity: "comfortable" } };
export const HiddenColumns: Story = { args: { hiddenColumns: true } };
export const SoleLocation: Story = {
  args: { initialStock: true, locationCount: "one" },
};
export const ArchivedProduct: Story = { args: { archivedFixture: true } };
export const Filters: Story = { args: { archivedFixture: true } };
export const EditingMixed: Story = { args: { saveFixture: "mixed" } };
export const EditingUnconfirmed: Story = {
  args: { saveFixture: "unconfirmed" },
};
