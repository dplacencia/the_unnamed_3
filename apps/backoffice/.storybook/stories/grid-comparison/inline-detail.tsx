import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { stockText, type AdapterProps, type Product } from "./model";

export function InlineDetail({
  record,
  props,
}: {
  record: Product;
  props: AdapterProps;
}) {
  const locale = useLocale();
  return (
    <div
      className="grid-inline"
      data-inline-id={record.id}
      data-inline-locale={locale}
      onKeyDown={(event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("button")
        )
          event.stopPropagation();
      }}
    >
      <span>{record.id}</span>
      <span>
        {props.view.stock
          ? stockText(record, props.view, props.text)
          : record.barcode}
      </span>
      <span data-inline-note>{props.drafts[record.id] ?? record.note}</span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => props.onDetails(record.id)}
      >
        {props.text.details}
      </Button>
    </div>
  );
}
