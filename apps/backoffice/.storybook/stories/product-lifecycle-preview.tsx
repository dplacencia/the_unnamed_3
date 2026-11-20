import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/configuration";
import { useProductEditing } from "./products-editing";
import {
  previewProducts,
  type PreviewProduct,
  type ProductStock,
} from "./products-table-model";
import { ProductsTableWorkspace } from "./products-table-preview";

const messages = {
  es: {
    archive: "Archivar producto",
    question: "¿Quieres archivar este producto?",
    effect:
      "Conservará su historial y dejará de aparecer en la lista de productos activos. Sus códigos dejarán de estar asignados.",
    cancel: "Cancelar",
    archived: "Producto archivado.",
    refused:
      "El producto sigue activo porque todavía tiene existencias registradas.",
    unconfirmed: "No hemos podido confirmar que se haya archivado el producto.",
    previous: "El estado que se muestra es el último que pudo consultarse.",
  },
  en: {
    archive: "Archive product",
    question: "Archive this product?",
    effect:
      "It keeps its history and leaves the active product list. Its codes will be unassigned.",
    cancel: "Cancel",
    archived: "Product archived.",
    refused: "The product is still active because it has recorded stock.",
    unconfirmed: "We could not confirm that the product was archived.",
    previous: "The displayed status is the last one we could retrieve.",
  },
  ca: {
    archive: "Arxiva el producte",
    question: "Vols arxivar aquest producte?",
    effect:
      "Conservarà l’historial i deixarà de sortir a la llista de productes actius. Els seus codis es desassignaran.",
    cancel: "Cancel·la",
    archived: "Producte arxivat.",
    refused:
      "El producte continua actiu perquè encara té existències registrades.",
    unconfirmed: "No hem pogut confirmar que s’hagi arxivat el producte.",
    previous: "Es mostra el darrer estat que s’ha pogut consultar.",
  },
  gl: {
    archive: "Arquivar produto",
    question: "Queres arquivar este produto?",
    effect:
      "Conservará o seu historial e deixará de aparecer na lista de produtos activos. Os seus códigos deixarán de estar asignados.",
    cancel: "Cancelar",
    archived: "Produto arquivado.",
    refused: "O produto segue activo porque aínda ten existencias rexistradas.",
    unconfirmed: "Non puidemos confirmar que se arquivase o produto.",
    previous: "O estado que se mostra é o último que se puido consultar.",
  },
  eu: {
    archive: "Artxibatu produktua",
    question: "Produktu hau artxibatu nahi duzu?",
    effect:
      "Historia gordeko du eta produktu aktiboen zerrendatik desagertuko da. Kodeak esleitu gabe geratuko dira.",
    cancel: "Utzi",
    archived: "Produktua artxibatu da.",
    refused: "Produktuak aktibo jarraitzen du, izakinak dituelako.",
    unconfirmed: "Ezin izan dugu baieztatu produktua artxibatu denik.",
    previous: "Kontsultatu ahal izan den azken egoera ageri da.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export const productLifecycleFixtures = [
  "review",
  "confirmation",
  "archived",
  "refused",
  "unconfirmed",
] as const;
type Fixture = (typeof productLifecycleFixtures)[number];
type Outcome = Exclude<Fixture, "review" | "confirmation">;

export function ProductLifecyclePreview({ fixture }: { fixture: Fixture }) {
  const copy = messages[useLocale() as Locale];
  const [initial] = useState(() => {
    const records = previewProducts();
    const product = records[0];
    const zero: ProductStock = {
      state: "known",
      measures: [{ dimension: "main", value: "0", unit: product.unit }],
    };
    if (fixture !== "refused")
      records[0] = {
        ...product,
        stock: { "sales-floor": zero, stockroom: zero },
        ...(fixture === "archived" && {
          archived: true,
          sku: null,
          barcodes: [],
        }),
      };
    return records;
  });
  const id = initial[0].id;
  const [confirming, setConfirming] = useState(
    fixture === "confirmation" ? id : null,
  );
  const [outcomes, setOutcomes] = useState<Partial<Record<string, Outcome>>>(
    fixture === "review" || fixture === "confirmation" ? {} : { [id]: fixture },
  );
  const { inspect, ...editing } = useProductEditing(initial, "confirmed");
  useEffect(() => {
    const frame = requestAnimationFrame(() => inspect(id));
    return () => cancelAnimationFrame(frame);
  }, [id, inspect]);

  function archive(product: PreviewProduct) {
    editing.recordPreviewArchive(product.id);
    setOutcomes((current) => ({ ...current, [product.id]: "archived" }));
    setConfirming(null);
  }

  return (
    <ProductsTableWorkspace
      editor={{ ...editing, inspect }}
      initialStock={false}
      initialDensity="compact"
      hiddenColumns={false}
      locationCount="one"
      archivedFixture={fixture === "archived"}
      viewKey={`irin-product-lifecycle-${fixture}`}
      archivePreview={(product) => {
        if (product.id !== id) return null;
        const outcome = outcomes[product.id];
        return (
          <section
            data-product-lifecycle-ready={fixture}
            className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700"
          >
            {outcome ? (
              <div
                role={outcome === "archived" ? "status" : "alert"}
                className="text-sm"
              >
                <p className="font-medium">{copy[outcome]}</p>
                {outcome === "unconfirmed" && <p>{copy.previous}</p>}
              </div>
            ) : confirming === product.id ? (
              <>
                <p className="font-semibold">{copy.question}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {copy.effect}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="max-sm:min-h-11"
                    onClick={() => setConfirming(null)}
                  >
                    {copy.cancel}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="max-sm:min-h-11"
                    onClick={() => archive(product)}
                  >
                    {copy.archive}
                  </Button>
                </div>
              </>
            ) : !product.archived ? (
              <Button
                size="sm"
                variant="outline"
                className="max-sm:min-h-11"
                onClick={() => setConfirming(product.id)}
              >
                {copy.archive}
              </Button>
            ) : null}
          </section>
        );
      }}
    />
  );
}
