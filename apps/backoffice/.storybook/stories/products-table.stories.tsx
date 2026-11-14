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
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "First browsing/inspection design with the selected TanStack Table foundation and TailAdmin controls. All products, locations, codes and quantities are synthetic; this is not an API integration. Compact/comfortable sizes, column widgets and missing-value copy are proposals for review. Filtering/editing flows, production pagination and persistence are later design work. The archived example simulates an explicitly included archived read. No candidate image is accepted automatically.",
      },
    },
  },
  render: (args) => (
    <ProductsTablePreview
      key={`${args.initialStock}:${args.initialDensity}:${args.hiddenColumns}:${args.locationCount}:${args.archivedFixture}`}
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
