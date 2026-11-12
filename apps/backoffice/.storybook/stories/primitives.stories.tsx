import { useTranslations } from "next-intl";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as AccordionUI from "../../src/components/ui/accordion";
import * as AlertUI from "../../src/components/ui/alert";
import * as AvatarUI from "../../src/components/ui/avatar";
import * as BadgeUI from "../../src/components/ui/badge";
import * as BreadcrumbUI from "../../src/components/ui/breadcrumb";
import * as ButtonUI from "../../src/components/ui/button";
import * as ButtonGroupUI from "../../src/components/ui/button-group";
import * as CardUI from "../../src/components/ui/card";
import * as CheckboxUI from "../../src/components/ui/checkbox";
import * as CollapsibleUI from "../../src/components/ui/collapsible";
import * as ComboboxUI from "../../src/components/ui/combobox";
import * as DialogUI from "../../src/components/ui/dialog";
import * as DropdownUI from "../../src/components/ui/dropdown";
import * as FieldUI from "../../src/components/ui/field";
import * as FileUI from "../../src/components/ui/file-input";
import * as InputUI from "../../src/components/ui/input";
import * as GroupUI from "../../src/components/ui/input-group";
import * as OtpUI from "../../src/components/ui/input-otp";
import * as LabelUI from "../../src/components/ui/label";
import * as PaginationUI from "../../src/components/ui/pagination";
import * as PopoverUI from "../../src/components/ui/popover";
import * as ProgressUI from "../../src/components/ui/progress-bar";
import * as RadioUI from "../../src/components/ui/radio-group";
import * as ResizeUI from "../../src/components/ui/resizable";
import * as ScrollUI from "../../src/components/ui/scroll-area";
import * as SelectUI from "../../src/components/ui/select";
import * as SeparatorUI from "../../src/components/ui/separator";
import * as SheetUI from "../../src/components/ui/sheet";
import * as SkeletonUI from "../../src/components/ui/skeleton";
import * as SliderUI from "../../src/components/ui/slider";
import * as SpinnerUI from "../../src/components/ui/spinner";
import * as SwitchUI from "../../src/components/ui/switch";
import * as TableUI from "../../src/components/ui/table";
import * as TabsUI from "../../src/components/ui/tabs";
import * as TextareaUI from "../../src/components/ui/textarea";
import * as ToggleUI from "../../src/components/ui/toggle";
import * as ToggleGroupUI from "../../src/components/ui/toggle-group";
import * as TooltipUI from "../../src/components/ui/tooltip";
import * as VideoUI from "../../src/components/ui/video";
import { PlusIcon, SearchIcon } from "../../src/icons";
type PreviewArgs = {
  label?: string;
  disabled?: boolean;
};
const meta = {
  title: "TailAdmin/Primitives",
  parameters: {
    docs: {
      description: {
        component:
          "Catálogo técnico de componentes reales. Apariencia TailAdmin provisional; ejemplos sin reglas de negocio.",
      },
    },
  },
} satisfies Meta<PreviewArgs>;
export default meta;
type Story = StoryObj<PreviewArgs>;
export const Button: Story = {
  args: { label: undefined, disabled: false },
  argTypes: {
    label: {
      control: "text",
      type: "string",
      description:
        "Leave unset for the selected language. Explicit custom text is preserved.",
    },
    disabled: { control: "boolean" },
  },
  render: function ButtonExample(args) {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-row">
        <ButtonUI.Button disabled={args.disabled === true}>
          {args.label ?? t("buttonLabel")}
        </ButtonUI.Button>
        <ButtonUI.Button variant="outline">{t("outline")}</ButtonUI.Button>
        <ButtonUI.Button variant="ghost">{t("ghost")}</ButtonUI.Button>
        <ButtonUI.Button variant="destructive">
          {t("destructive")}
        </ButtonUI.Button>
        <ButtonUI.Button disabled>{t("disabled")}</ButtonUI.Button>
        <ButtonUI.Button size="icon" aria-label={t("addSample")}>
          <PlusIcon />
        </ButtonUI.Button>
        <ButtonUI.Button variant="link">{t("link")}</ButtonUI.Button>
      </div>
    );
  },
};
export const Input: Story = {
  render: function InputExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <FieldUI.Field>
          <FieldUI.FieldLabel>{t("sampleText")}</FieldUI.FieldLabel>
          <InputUI.Input placeholder={t("writeHere")} />
        </FieldUI.Field>
        <FieldUI.Field>
          <FieldUI.FieldLabel>{t("exactValue")}</FieldUI.FieldLabel>
          <InputUI.Input defaultValue="9007199254740993" />
        </FieldUI.Field>
        <FieldUI.Field>
          <FieldUI.FieldLabel>{t("sampleErrorField")}</FieldUI.FieldLabel>
          <InputUI.Input aria-invalid="true" aria-describedby="input-error" />
          <FieldUI.FieldError id="input-error">
            {t("technicalError")}
          </FieldUI.FieldError>
        </FieldUI.Field>
        <InputUI.Input
          aria-label={t("disabledField")}
          disabled
          value={t("disabled")}
        />
      </div>
    );
  },
};
export const Textarea: Story = {
  render: function TextareaExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <FieldUI.Field>
          <FieldUI.FieldLabel>{t("longSampleText")}</FieldUI.FieldLabel>
          <TextareaUI.Textarea rows={4} placeholder={t("writeSeveralLines")} />
        </FieldUI.Field>
        <TextareaUI.Textarea
          aria-label={t("disabledText")}
          disabled
          value={t("sampleContent")}
        />
      </div>
    );
  },
};
export const Select: Story = {
  render: function SelectExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <SelectUI.Select
          defaultValue="one"
          items={[
            { value: "one", label: t("optionOne") },
            { value: "two", label: t("optionTwo") },
          ]}
        >
          <SelectUI.SelectTrigger aria-label={t("sampleSelection")}>
            <SelectUI.SelectValue />
          </SelectUI.SelectTrigger>
          <SelectUI.SelectContent>
            <SelectUI.SelectGroup>
              <SelectUI.SelectLabel>{t("options")}</SelectUI.SelectLabel>
              <SelectUI.SelectItem value="one">
                {t("optionOne")}
              </SelectUI.SelectItem>
              <SelectUI.SelectItem value="two">
                {t("optionTwo")}
              </SelectUI.SelectItem>
              <SelectUI.SelectSeparator />
              <SelectUI.SelectItem value="disabled" disabled>
                {t("disabledFeminine")}
              </SelectUI.SelectItem>
            </SelectUI.SelectGroup>
          </SelectUI.SelectContent>
        </SelectUI.Select>
      </div>
    );
  },
};
export const Accordion: Story = {
  render: function AccordionExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <AccordionUI.Accordion defaultValue={["first"]}>
          <AccordionUI.AccordionItem value="first">
            <AccordionUI.AccordionTrigger>
              {t("firstSection")}
            </AccordionUI.AccordionTrigger>
            <AccordionUI.AccordionContent>
              {t("firstSectionContent")}
            </AccordionUI.AccordionContent>
          </AccordionUI.AccordionItem>
          <AccordionUI.AccordionItem value="second">
            <AccordionUI.AccordionTrigger>
              {t("secondSection")}
            </AccordionUI.AccordionTrigger>
            <AccordionUI.AccordionContent>
              {t("secondSectionContent")}
            </AccordionUI.AccordionContent>
          </AccordionUI.AccordionItem>
        </AccordionUI.Accordion>
      </div>
    );
  },
};
export const Alert: Story = {
  render: function AlertExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        {(
          ["default", "info", "success", "warning", "destructive"] as const
        ).map((variant) => (
          <AlertUI.Alert key={variant} variant={variant}>
            <AlertUI.AlertTitle>
              {t("sampleVariant", { variant })}
            </AlertUI.AlertTitle>
            <AlertUI.AlertDescription>
              {t("compositionReview")}
            </AlertUI.AlertDescription>
          </AlertUI.Alert>
        ))}
      </div>
    );
  },
};
export const Avatar: Story = {
  render: function AvatarExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <div className="visual-row">
          {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
            <AvatarUI.Avatar key={size} size={size}>
              <AvatarUI.AvatarFallback>AB</AvatarUI.AvatarFallback>
              <AvatarUI.AvatarBadge />
            </AvatarUI.Avatar>
          ))}
          <AvatarUI.Avatar>
            <AvatarUI.AvatarImage
              src="/images/logo/logo-icon.svg"
              alt={t("vendorImage")}
            />
            <AvatarUI.AvatarFallback>CD</AvatarUI.AvatarFallback>
          </AvatarUI.Avatar>
        </div>
        <AvatarUI.AvatarGroup>
          <AvatarUI.Avatar>
            <AvatarUI.AvatarFallback>AB</AvatarUI.AvatarFallback>
          </AvatarUI.Avatar>
          <AvatarUI.Avatar>
            <AvatarUI.AvatarFallback>CD</AvatarUI.AvatarFallback>
          </AvatarUI.Avatar>
          <AvatarUI.AvatarGroupCount>+3</AvatarUI.AvatarGroupCount>
        </AvatarUI.AvatarGroup>
      </div>
    );
  },
};
export const Badge: Story = {
  render: function BadgeExample() {
    return (
      <div className="visual-stack">
        {(["light", "solid", "ghost"] as const).map((variant) => (
          <div className="visual-row" key={variant}>
            {(
              [
                "primary",
                "success",
                "error",
                "warning",
                "info",
                "gray",
                "light",
                "dark",
              ] as const
            ).map((color) => (
              <BadgeUI.Badge key={color} color={color} variant={variant}>
                {color}
              </BadgeUI.Badge>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
export const Breadcrumb: Story = {
  render: function BreadcrumbExample() {
    const t = useTranslations("catalogue");
    return (
      <BreadcrumbUI.Breadcrumb aria-label={t("breadcrumbs")}>
        <BreadcrumbUI.BreadcrumbList>
          <BreadcrumbUI.BreadcrumbItem>
            <BreadcrumbUI.BreadcrumbLink href="/">
              {t("home")}
            </BreadcrumbUI.BreadcrumbLink>
          </BreadcrumbUI.BreadcrumbItem>
          <BreadcrumbUI.BreadcrumbSeparator />
          <BreadcrumbUI.BreadcrumbItem>
            <BreadcrumbUI.BreadcrumbEllipsis />
          </BreadcrumbUI.BreadcrumbItem>
          <BreadcrumbUI.BreadcrumbSeparator />
          <BreadcrumbUI.BreadcrumbItem>
            <BreadcrumbUI.BreadcrumbPage>
              {t("samplePage")}
            </BreadcrumbUI.BreadcrumbPage>
          </BreadcrumbUI.BreadcrumbItem>
        </BreadcrumbUI.BreadcrumbList>
      </BreadcrumbUI.Breadcrumb>
    );
  },
};
export const ButtonGroup: Story = {
  render: function ButtonGroupExample() {
    const t = useTranslations("catalogue");
    return (
      <ButtonGroupUI.ButtonGroup>
        <ButtonGroupUI.ButtonGroupText>
          {t("group")}
        </ButtonGroupUI.ButtonGroupText>
        <ButtonUI.Button variant="outline">{t("first")}</ButtonUI.Button>
        <ButtonGroupUI.ButtonGroupSeparator />
        <ButtonUI.Button variant="outline">{t("second")}</ButtonUI.Button>
      </ButtonGroupUI.ButtonGroup>
    );
  },
};
export const Card: Story = {
  render: function CardExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <CardUI.Card>
          <CardUI.CardHeader>
            <CardUI.CardTitle>{t("sampleCard")}</CardUI.CardTitle>
            <CardUI.CardDescription>
              {t("compositionDescription")}
            </CardUI.CardDescription>
            <CardUI.CardAction>
              <ButtonUI.Button size="sm" variant="outline">
                {t("action")}
              </ButtonUI.Button>
            </CardUI.CardAction>
          </CardUI.CardHeader>
          <CardUI.CardContent>{t("realComponentContent")}</CardUI.CardContent>
          <CardUI.CardFooter>{t("sampleFooter")}</CardUI.CardFooter>
        </CardUI.Card>
      </div>
    );
  },
};
export const Checkbox: Story = {
  render: function CheckboxExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <FieldUI.Field orientation="horizontal">
          <CheckboxUI.Checkbox id="checkbox-off" />
          <FieldUI.FieldLabel htmlFor="checkbox-off">
            {t("sampleOption")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
        <FieldUI.Field orientation="horizontal">
          <CheckboxUI.Checkbox id="checkbox-on" defaultChecked />
          <FieldUI.FieldLabel htmlFor="checkbox-on">
            {t("selectedFeminine")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
        <FieldUI.Field orientation="horizontal">
          <CheckboxUI.Checkbox id="checkbox-disabled" disabled />
          <FieldUI.FieldLabel htmlFor="checkbox-disabled">
            {t("disabledFeminine")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
      </div>
    );
  },
};
export const Collapsible: Story = {
  render: function CollapsibleExample() {
    const t = useTranslations("catalogue");
    return (
      <CollapsibleUI.Collapsible>
        <CollapsibleUI.CollapsibleTrigger
          render={<ButtonUI.Button variant="outline" />}
        >
          {t("showContent")}
        </CollapsibleUI.CollapsibleTrigger>
        <CollapsibleUI.CollapsibleContent>
          <p className="py-4">{t("collapsibleContent")}</p>
        </CollapsibleUI.CollapsibleContent>
      </CollapsibleUI.Collapsible>
    );
  },
};
export const Combobox: Story = {
  render: function ComboboxExample() {
    const t = useTranslations("catalogue");
    const options: Record<string, string> = {
      one: t("optionOne"),
      two: t("optionTwo"),
      three: t("optionThree"),
    };
    return (
      <div className="visual-stack">
        <ComboboxUI.Combobox<string>
          items={Object.keys(options)}
          itemToStringLabel={(item) => options[item]}
        >
          <ComboboxUI.ComboboxInput
            aria-label={t("searchSampleOption")}
            showClear
            clearLabel={t("clearSelection")}
          />
          <ComboboxUI.ComboboxContent>
            <ComboboxUI.ComboboxEmpty>
              {t("noMatches")}
            </ComboboxUI.ComboboxEmpty>
            <ComboboxUI.ComboboxList>
              {(item: string) => (
                <ComboboxUI.ComboboxItem key={item} value={item}>
                  {options[item]}
                </ComboboxUI.ComboboxItem>
              )}
            </ComboboxUI.ComboboxList>
          </ComboboxUI.ComboboxContent>
        </ComboboxUI.Combobox>
      </div>
    );
  },
};
export const Dialog: Story = {
  render: function DialogExample() {
    const t = useTranslations("catalogue");
    return (
      <DialogUI.Dialog>
        <DialogUI.DialogTrigger render={<ButtonUI.Button />}>
          {t("openDialog")}
        </DialogUI.DialogTrigger>
        <DialogUI.DialogContent closeLabel={t("close")}>
          <DialogUI.DialogHeader>
            <DialogUI.DialogTitle>{t("sampleDialog")}</DialogUI.DialogTitle>
            <DialogUI.DialogDescription>
              {t("dialogDescription")}
            </DialogUI.DialogDescription>
          </DialogUI.DialogHeader>
          <p>{t("sampleTextSentence")}</p>
          <DialogUI.DialogFooter>
            <DialogUI.DialogClose
              render={<ButtonUI.Button variant="outline" />}
            >
              {t("closeSample")}
            </DialogUI.DialogClose>
          </DialogUI.DialogFooter>
        </DialogUI.DialogContent>
      </DialogUI.Dialog>
    );
  },
};
export const Dropdown: Story = {
  render: function DropdownExample() {
    const t = useTranslations("catalogue");
    return (
      <DropdownUI.DropdownMenu>
        <DropdownUI.DropdownMenuTrigger
          render={<ButtonUI.Button variant="outline" />}
        >
          {t("openMenu")}
        </DropdownUI.DropdownMenuTrigger>
        <DropdownUI.DropdownMenuContent>
          <DropdownUI.DropdownMenuGroup>
            <DropdownUI.DropdownMenuLabel>
              {t("sampleMenu")}
            </DropdownUI.DropdownMenuLabel>
            <DropdownUI.DropdownMenuItem>
              {t("firstOption")}
              <DropdownUI.DropdownMenuShortcut>
                ⌘K
              </DropdownUI.DropdownMenuShortcut>
            </DropdownUI.DropdownMenuItem>
            <DropdownUI.DropdownMenuItem disabled>
              {t("disabledOption")}
            </DropdownUI.DropdownMenuItem>
            <DropdownUI.DropdownMenuSeparator />
            <DropdownUI.DropdownMenuCheckboxItem defaultChecked>
              {t("selectedOption")}
            </DropdownUI.DropdownMenuCheckboxItem>
            <DropdownUI.DropdownMenuSub>
              <DropdownUI.DropdownMenuSubTrigger>
                {t("moreOptions")}
              </DropdownUI.DropdownMenuSubTrigger>
              <DropdownUI.DropdownMenuSubContent>
                <DropdownUI.DropdownMenuItem>
                  {t("nestedOption")}
                </DropdownUI.DropdownMenuItem>
              </DropdownUI.DropdownMenuSubContent>
            </DropdownUI.DropdownMenuSub>
          </DropdownUI.DropdownMenuGroup>
        </DropdownUI.DropdownMenuContent>
      </DropdownUI.DropdownMenu>
    );
  },
};
export const Field: Story = {
  render: function FieldExample() {
    const t = useTranslations("catalogue");
    return (
      <FieldUI.FieldSet className="visual-stack">
        <FieldUI.FieldLegend>{t("sampleFieldGroup")}</FieldUI.FieldLegend>
        <FieldUI.FieldGroup>
          <FieldUI.Field>
            <FieldUI.FieldLabel>{t("automaticLabel")}</FieldUI.FieldLabel>
            <InputUI.Input placeholder={t("linkedField")} />
            <FieldUI.FieldDescription>
              {t("sampleDescription")}
            </FieldUI.FieldDescription>
          </FieldUI.Field>
          <FieldUI.FieldSeparator>{t("separator")}</FieldUI.FieldSeparator>
          <FieldUI.Field data-invalid="true">
            <FieldUI.FieldLabel>{t("errorField")}</FieldUI.FieldLabel>
            <InputUI.Input
              aria-invalid="true"
              aria-describedby="field-sample-error"
            />
            <FieldUI.FieldError
              id="field-sample-error"
              errors={[
                { message: t("firstMessage") },
                { message: t("secondMessage") },
              ]}
            />
          </FieldUI.Field>
        </FieldUI.FieldGroup>
      </FieldUI.FieldSet>
    );
  },
};
export const FileInput: Story = {
  render: function FileInputExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <FieldUI.Field>
          <FieldUI.FieldLabel>{t("sampleFile")}</FieldUI.FieldLabel>
          <FileUI.FileInput />
        </FieldUI.Field>
        <FileUI.FileInput aria-label={t("disabledFile")} disabled />
        <p className="text-sm text-gray-500">{t("nativeFileNote")}</p>
      </div>
    );
  },
};
export const InputGroup: Story = {
  render: function InputGroupExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <GroupUI.InputGroup>
          <GroupUI.InputGroupInput
            aria-label={t("searchSample")}
            placeholder={t("search")}
          />
          <GroupUI.InputGroupAddon>
            <SearchIcon />
          </GroupUI.InputGroupAddon>
          <GroupUI.InputGroupAddon align="inline-end">
            <GroupUI.InputGroupButton>{t("action")}</GroupUI.InputGroupButton>
          </GroupUI.InputGroupAddon>
        </GroupUI.InputGroup>
        <GroupUI.InputGroup>
          <GroupUI.InputGroupTextarea
            aria-label={t("groupedText")}
            placeholder={t("longText")}
          />
          <GroupUI.InputGroupAddon align="block-end">
            <GroupUI.InputGroupText>
              {t("supportingText")}
            </GroupUI.InputGroupText>
          </GroupUI.InputGroupAddon>
        </GroupUI.InputGroup>
      </div>
    );
  },
};
export const InputOtp: Story = {
  render: function InputOtpExample() {
    const t = useTranslations("catalogue");
    return (
      <OtpUI.InputOTP
        maxLength={6}
        aria-label={t("sampleCode")}
        defaultValue="123"
      >
        <OtpUI.InputOTPGroup>
          {[0, 1, 2].map((index) => (
            <OtpUI.InputOTPSlot key={index} index={index} />
          ))}
        </OtpUI.InputOTPGroup>
        <OtpUI.InputOTPSeparator />
        <OtpUI.InputOTPGroup>
          {[3, 4, 5].map((index) => (
            <OtpUI.InputOTPSlot key={index} index={index} />
          ))}
        </OtpUI.InputOTPGroup>
      </OtpUI.InputOTP>
    );
  },
};
export const Label: Story = {
  render: function LabelExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <LabelUI.Label htmlFor="standalone-label">
          {t("standaloneLabel")}
        </LabelUI.Label>
        <InputUI.Input id="standalone-label" placeholder={t("sampleControl")} />
      </div>
    );
  },
};
export const Pagination: Story = {
  render: function PaginationExample() {
    const t = useTranslations("catalogue");
    return (
      <PaginationUI.Pagination aria-label={t("pagination")}>
        <PaginationUI.PaginationContent>
          <PaginationUI.PaginationItem>
            <PaginationUI.PaginationPrevious
              href="#previous"
              text={t("previous")}
              aria-label={t("previousPage")}
            />
          </PaginationUI.PaginationItem>
          <PaginationUI.PaginationItem>
            <PaginationUI.PaginationLink href="#one" isActive>
              1
            </PaginationUI.PaginationLink>
          </PaginationUI.PaginationItem>
          <PaginationUI.PaginationItem>
            <PaginationUI.PaginationLink href="#two">
              2
            </PaginationUI.PaginationLink>
          </PaginationUI.PaginationItem>
          <PaginationUI.PaginationItem>
            <PaginationUI.PaginationEllipsis />
          </PaginationUI.PaginationItem>
          <PaginationUI.PaginationItem>
            <PaginationUI.PaginationNext
              href="#next"
              text={t("next")}
              aria-label={t("nextPage")}
            />
          </PaginationUI.PaginationItem>
        </PaginationUI.PaginationContent>
      </PaginationUI.Pagination>
    );
  },
};
export const Popover: Story = {
  render: function PopoverExample() {
    const t = useTranslations("catalogue");
    return (
      <PopoverUI.Popover>
        <PopoverUI.PopoverTrigger
          render={<ButtonUI.Button variant="outline" />}
        >
          {t("openPopover")}
        </PopoverUI.PopoverTrigger>
        <PopoverUI.PopoverContent>
          <PopoverUI.PopoverHeader>
            <PopoverUI.PopoverTitle>
              {t("samplePopover")}
            </PopoverUI.PopoverTitle>
            <PopoverUI.PopoverDescription>
              {t("sampleDescription")}
            </PopoverUI.PopoverDescription>
          </PopoverUI.PopoverHeader>
          <PopoverUI.PopoverBody>{t("popoverContent")}</PopoverUI.PopoverBody>
          <PopoverUI.PopoverFooter>
            <PopoverUI.PopoverClose render={<ButtonUI.Button size="sm" />}>
              {t("close")}
            </PopoverUI.PopoverClose>
          </PopoverUI.PopoverFooter>
        </PopoverUI.PopoverContent>
      </PopoverUI.Popover>
    );
  },
};
export const Progress: Story = {
  render: function ProgressExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <ProgressUI.Progress value={65}>
          <ProgressUI.ProgressLabel>
            {t("sampleProgress")}
          </ProgressUI.ProgressLabel>
          <ProgressUI.ProgressValue />
          <ProgressUI.ProgressTrack>
            <ProgressUI.ProgressIndicator />
          </ProgressUI.ProgressTrack>
        </ProgressUI.Progress>
        <ProgressUI.Progress value={0} aria-label={t("initialProgress")} />
        <ProgressUI.Progress value={100} aria-label={t("completeProgress")} />
      </div>
    );
  },
};
export const RadioGroup: Story = {
  render: function RadioGroupExample() {
    const t = useTranslations("catalogue");
    return (
      <RadioUI.RadioGroup defaultValue="one" aria-label={t("sampleGroup")}>
        <FieldUI.Field orientation="horizontal">
          <RadioUI.RadioGroupItem value="one" id="radio-one" />
          <FieldUI.FieldLabel htmlFor="radio-one">
            {t("firstOption")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
        <FieldUI.Field orientation="horizontal">
          <RadioUI.RadioGroupItem value="two" id="radio-two" />
          <FieldUI.FieldLabel htmlFor="radio-two">
            {t("secondOption")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
        <FieldUI.Field orientation="horizontal">
          <RadioUI.RadioGroupItem
            value="disabled"
            id="radio-disabled"
            disabled
          />
          <FieldUI.FieldLabel htmlFor="radio-disabled">
            {t("disabledFeminine")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
      </RadioUI.RadioGroup>
    );
  },
};
export const Resizable: Story = {
  render: function ResizableExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="h-56 max-w-180 rounded-lg border border-gray-300 dark:border-gray-700">
        <ResizeUI.ResizablePanelGroup orientation="horizontal">
          <ResizeUI.ResizablePanel defaultSize={50}>
            <div className="p-4">{t("panelOne")}</div>
          </ResizeUI.ResizablePanel>
          <ResizeUI.ResizableHandle withHandle />
          <ResizeUI.ResizablePanel defaultSize={50}>
            <div className="p-4">{t("panelTwo")}</div>
          </ResizeUI.ResizablePanel>
        </ResizeUI.ResizablePanelGroup>
      </div>
    );
  },
};
export const ScrollArea: Story = {
  render: function ScrollAreaExample() {
    const t = useTranslations("catalogue");
    return (
      <ScrollUI.ScrollArea
        className="h-56 max-w-180 rounded-lg border border-gray-300 p-4 dark:border-gray-700"
        scrollbars="both"
      >
        <div className="min-w-160">
          {Array.from({ length: 16 }, (_, index) => (
            <p className="py-2" key={index}>
              {t("scrollRow", { index: index + 1 })}
            </p>
          ))}
        </div>
      </ScrollUI.ScrollArea>
    );
  },
};
export const Separator: Story = {
  render: function SeparatorExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <p>{t("previousContent")}</p>
        <SeparatorUI.Separator />
        <div className="visual-row h-10">
          <span>{t("first")}</span>
          <SeparatorUI.Separator orientation="vertical" />
          <span>{t("second")}</span>
        </div>
      </div>
    );
  },
};
export const Sheet: Story = {
  render: function SheetExample() {
    const t = useTranslations("catalogue");
    return (
      <SheetUI.Sheet>
        <SheetUI.SheetTrigger render={<ButtonUI.Button variant="outline" />}>
          {t("openSheet")}
        </SheetUI.SheetTrigger>
        <SheetUI.SheetContent closeLabel={t("close")}>
          <SheetUI.SheetHeader>
            <SheetUI.SheetTitle>{t("sampleSheet")}</SheetUI.SheetTitle>
            <SheetUI.SheetDescription>
              {t("sheetDescription")}
            </SheetUI.SheetDescription>
          </SheetUI.SheetHeader>
          <div className="p-4">{t("sampleContentSentence")}</div>
          <SheetUI.SheetFooter>
            <SheetUI.SheetClose render={<ButtonUI.Button />}>
              {t("closeSheet")}
            </SheetUI.SheetClose>
          </SheetUI.SheetFooter>
        </SheetUI.SheetContent>
      </SheetUI.Sheet>
    );
  },
};
export const Skeleton: Story = {
  render: function SkeletonExample() {
    return (
      <div className="visual-stack">
        <SkeletonUI.Skeleton className="size-12 rounded-full" />
        <SkeletonUI.Skeleton className="h-5 w-56" />
        <SkeletonUI.Skeleton className="h-4 w-full" />
        <SkeletonUI.Skeleton className="h-4 w-3/4" />
      </div>
    );
  },
};
export const Slider: Story = {
  render: function SliderExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <SliderUI.Slider aria-label={t("sampleValue")} defaultValue={[35]} />
        <SliderUI.Slider
          aria-label={t("sampleRange")}
          defaultValue={[20, 70]}
        />
        <SliderUI.Slider
          aria-label={t("disabledControl")}
          defaultValue={[50]}
          disabled
        />
      </div>
    );
  },
};
export const Spinner: Story = {
  render: function SpinnerExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-row">
        <SpinnerUI.Spinner className="size-4" aria-label={t("loading")} />
        <SpinnerUI.Spinner className="size-6" aria-label={t("loading")} />
        <SpinnerUI.Spinner className="size-8" aria-label={t("loading")} />
        <span>{t("loadingIndicators")}</span>
      </div>
    );
  },
};
export const Switch: Story = {
  render: function SwitchExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <FieldUI.Field orientation="horizontal">
          <SwitchUI.Switch id="switch-off" />
          <FieldUI.FieldLabel htmlFor="switch-off">
            {t("sampleSwitch")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
        <FieldUI.Field orientation="horizontal">
          <SwitchUI.Switch id="switch-on" defaultChecked />
          <FieldUI.FieldLabel htmlFor="switch-on">
            {t("enabled")}
          </FieldUI.FieldLabel>
        </FieldUI.Field>
        <SwitchUI.Switch aria-label={t("disabledSwitch")} disabled />
      </div>
    );
  },
};
export const Table: Story = {
  render: function TableExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <TableUI.Table className="text-sm">
          <TableUI.TableHeader>
            <TableUI.TableRow>
              <TableUI.TableCell isHeader className="p-3 text-start">
                {t("columnOne")}
              </TableUI.TableCell>
              <TableUI.TableCell isHeader className="p-3 text-start">
                {t("exactSampleString")}
              </TableUI.TableCell>
            </TableUI.TableRow>
          </TableUI.TableHeader>
          <TableUI.TableBody>
            {[
              "9007199254740993",
              "00012.3400",
              "0.000000000000000000000000000001",
            ].map((value, index) => (
              <TableUI.TableRow key={value}>
                <TableUI.TableCell className="p-3">
                  {t("tableRow", { index: index + 1 })}
                </TableUI.TableCell>
                <TableUI.TableCell className="font-mono p-3">
                  {value}
                </TableUI.TableCell>
              </TableUI.TableRow>
            ))}
          </TableUI.TableBody>
        </TableUI.Table>
      </div>
    );
  },
};
export const Tabs: Story = {
  render: function TabsExample() {
    const t = useTranslations("catalogue");
    return (
      <TabsUI.Tabs defaultValue="one">
        <TabsUI.TabsList>
          <TabsUI.TabsTrigger value="one">{t("firstTab")}</TabsUI.TabsTrigger>
          <TabsUI.TabsTrigger value="two">{t("secondTab")}</TabsUI.TabsTrigger>
          <TabsUI.TabsTrigger value="disabled" disabled>
            {t("disabledFeminine")}
          </TabsUI.TabsTrigger>
        </TabsUI.TabsList>
        <TabsUI.TabsContent value="one">
          {t("firstTabContent")}
        </TabsUI.TabsContent>
        <TabsUI.TabsContent value="two">
          {t("secondTabContent")}
        </TabsUI.TabsContent>
      </TabsUI.Tabs>
    );
  },
};
export const Toggle: Story = {
  render: function ToggleExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-row">
        <ToggleUI.Toggle aria-label={t("toggleSample")}>
          {t("toggle")}
        </ToggleUI.Toggle>
        <ToggleUI.Toggle defaultPressed>{t("selected")}</ToggleUI.Toggle>
        <ToggleUI.Toggle disabled>{t("disabled")}</ToggleUI.Toggle>
      </div>
    );
  },
};
export const ToggleGroup: Story = {
  render: function ToggleGroupExample() {
    const t = useTranslations("catalogue");
    return (
      <ToggleGroupUI.ToggleGroup
        defaultValue={["one"]}
        aria-label={t("toggleGroup")}
      >
        <ToggleGroupUI.ToggleGroupItem value="one">
          {t("first")}
        </ToggleGroupUI.ToggleGroupItem>
        <ToggleGroupUI.ToggleGroupItem value="two">
          {t("second")}
        </ToggleGroupUI.ToggleGroupItem>
        <ToggleGroupUI.ToggleGroupItem value="three" disabled>
          {t("disabled")}
        </ToggleGroupUI.ToggleGroupItem>
      </ToggleGroupUI.ToggleGroup>
    );
  },
};
export const Tooltip: Story = {
  render: function TooltipExample() {
    const t = useTranslations("catalogue");
    return (
      <TooltipUI.Tooltip>
        <TooltipUI.TooltipTrigger
          render={<ButtonUI.Button variant="outline" />}
        >
          {t("sampleHelp")}
        </TooltipUI.TooltipTrigger>
        <TooltipUI.TooltipContent>{t("helpContent")}</TooltipUI.TooltipContent>
      </TooltipUI.Tooltip>
    );
  },
};
export const Video: Story = {
  parameters: {
    visual: { externalMedia: true },
    docs: {
      description: {
        story:
          "El caso automatizado sustituye el documento externo por una muestra determinista. Comprueba el marco y su proporción, no la reproducción de YouTube.",
      },
    },
  },
  render: function VideoExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="visual-stack">
        <p>{t("videoNote")}</p>
        <VideoUI.Video videoId="visual-fixture" title={t("sampleVideoFrame")} />
      </div>
    );
  },
};
