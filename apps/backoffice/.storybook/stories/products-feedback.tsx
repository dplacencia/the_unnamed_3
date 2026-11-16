import { useId, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
} from "@/icons";
import { cn } from "@/utils";

export type ProductsFeedbackTone = "info" | "success" | "warning" | "error";

type ToggleAttributes = {
  "data-edit-dismiss-results"?: boolean;
  "data-edit-show-results"?: boolean;
};

export type ProductsFeedbackProps = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  label: string;
  summary: ReactNode;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  detailsLabel: string;
  expandLabel: string;
  collapseLabel: string;
  disabled?: boolean;
  tone?: ProductsFeedbackTone;
  children: ReactNode;
  footer?: ReactNode;
  toggleAttributes?: ToggleAttributes;
};

export function ProductsFeedback({
  label,
  summary,
  expanded,
  onExpandedChange,
  detailsLabel,
  expandLabel,
  collapseLabel,
  disabled = false,
  tone = "info",
  children,
  footer,
  toggleAttributes,
  className,
  role = "group",
  ...props
}: ProductsFeedbackProps) {
  const detailsId = useId();
  const StatusIcon =
    tone === "success"
      ? CheckCircleIcon
      : tone === "warning" || tone === "error"
        ? AlertIcon
        : InfoIcon;
  return (
    <section
      {...props}
      role={role}
      className={cn("products-feedback", className)}
      aria-label={label}
      data-products-feedback
      data-feedback-tone={tone}
    >
      <div className="products-feedback-header">
        <StatusIcon
          className="products-feedback-icon size-4"
          aria-hidden="true"
        />
        <p
          className="products-feedback-summary"
          role="status"
          aria-atomic="true"
        >
          {summary}
        </p>
        <Button
          {...toggleAttributes}
          type="button"
          variant="ghost"
          size="sm"
          className="products-feedback-toggle"
          data-products-feedback-toggle
          aria-expanded={expanded}
          aria-controls={detailsId}
          aria-label={`${detailsLabel}: ${expanded ? collapseLabel : expandLabel}`}
          title={expanded ? collapseLabel : expandLabel}
          disabled={disabled}
          onClick={() => onExpandedChange(!expanded)}
        >
          <span>{detailsLabel}</span>
          {expanded ? (
            <ChevronUpIcon className="size-4" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      <div
        id={detailsId}
        className="products-feedback-details"
        hidden={!expanded}
      >
        {expanded ? children : null}
      </div>
      {footer && <div className="products-feedback-footer">{footer}</div>}
    </section>
  );
}
