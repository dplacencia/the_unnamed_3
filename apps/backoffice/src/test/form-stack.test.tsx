import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Synthetic integration data only; this is not a product schema or form.
const schema = z.object({
  value: z.string().min(1, { error: "Fixture value required" }),
});
type Values = z.output<typeof schema>;

function Fixture({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, Values>({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Field controlId="fixture-value" data-invalid={Boolean(errors.value)}>
        <FieldLabel>Fixture value</FieldLabel>
        <Input
          {...register("value")}
          type="text"
          aria-invalid={Boolean(errors.value)}
          aria-describedby={errors.value ? "fixture-error" : undefined}
        />
        <FieldError id="fixture-error" errors={[errors.value]} />
      </Field>
      <Button type="submit">Submit fixture</Button>
    </form>
  );
}

describe("approved form stack with retained TailAdmin controls", () => {
  it("blocks invalid submission, links its error, then accepts corrected input", async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox", { name: "Fixture value" });
    fireEvent.click(screen.getByRole("button", { name: "Submit fixture" }));

    const error = await screen.findByRole("alert");
    expect(error.textContent).toBe("Fixture value required");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(error.id);
    await waitFor(() => expect(document.activeElement).toBe(input));

    fireEvent.change(input, { target: { value: "fixture text" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit fixture" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toEqual({ value: "fixture text" });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  it.each([
    "9007199254740993",
    "0.000000000000000000000000000001",
    "00012.3400",
  ])("submits the exact string %s without coercion", async (value) => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Fixture value" }), {
      target: { value },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit fixture" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toEqual({ value });
  });
});
