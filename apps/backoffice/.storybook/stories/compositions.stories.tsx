import { useTranslations } from "next-intl";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentType, SVGProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ComponentCard from "../../src/components/common/component-card";
import PageBreadcrumb from "../../src/components/common/page-breadcrumb";
import GridShape from "../../src/components/common/grid-shape";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/components/ui/accordion";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../src/components/ui/field";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/components/ui/tabs";
import { Input } from "../../src/components/ui/input";
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInput,
} from "../../src/components/ui/sidebar";
import AppHeader from "../../src/layout/app-layout/header";
import AppSidebar from "../../src/layout/app-layout/sidebar";
import ThemeToggle from "../../src/layout/header/theme-toggler";
import AdminLayout from "../../src/app/(admin-layout)/layout";
import NotFound from "../../src/app/not-found";
import * as Icons from "../../src/icons";
const meta = { title: "TailAdmin/Compositions" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const ComponentCardExample: Story = {
  render: function ComponentCardExampleExample() {
    const t = useTranslations("catalogue");
    return (
      <ComponentCard
        title={t("technicalSampleCard")}
        desc={t("vendorComposition")}
      >
        <Input aria-label={t("cardControl")} placeholder={t("sampleField")} />
      </ComponentCard>
    );
  },
};
export const PageBreadcrumbExample: Story = {
  render: function PageBreadcrumbExampleExample() {
    const t = useTranslations("catalogue");
    return <PageBreadcrumb pageTitle={t("technicalSampleView")} />;
  },
};
export const GridShapeExample: Story = {
  render: function GridShapeExampleExample() {
    const t = useTranslations("catalogue");
    return (
      <div className="relative isolate h-80 overflow-hidden">
        <GridShape />
        <p className="p-6">{t("vendorBackground")}</p>
      </div>
    );
  },
};
export const Header: Story = {
  render: function HeaderExample() {
    return (
      <SidebarProvider>
        <SidebarInset>
          <AppHeader />
        </SidebarInset>
      </SidebarProvider>
    );
  },
};
export const ThemeControl: Story = {
  render: function ThemeControlExample() {
    return <ThemeToggle />;
  },
};
export const AppSidebarExample: Story = {
  parameters: { visual: { fullscreen: true } },
  render: function AppSidebarExampleExample() {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
        </SidebarInset>
      </SidebarProvider>
    );
  },
};
export const Shell: Story = {
  parameters: { visual: { fullscreen: true } },
  render: function ShellExample() {
    const t = useTranslations("catalogue");
    return (
      <AdminLayout>
        <p className="text-sm text-gray-500">{t("shellContent")}</p>
      </AdminLayout>
    );
  },
};
export const NotFoundExample: Story = {
  parameters: { visual: { fullscreen: true } },
  render: function NotFoundExampleExample() {
    return <NotFound />;
  },
};
export const BrandTextRoles: Story = {
  render: function BrandTextRolesExample() {
    const t = useTranslations("catalogue");
    return (
      <div id="brand-text-roles" className="visual-stack">
        <div className="visual-row">
          <Button variant="link" data-brand-text-role="link">
            {t("link")}
          </Button>
          <Badge
            color="primary"
            variant="light"
            data-brand-text-role="light-badge"
          >
            {t("selectedItem")}
          </Badge>
          <Badge
            color="primary"
            variant="ghost"
            data-brand-text-role="ghost-badge"
          >
            {t("selectedItem")}
          </Badge>
          <Button data-brand-text-role="filled-action">
            {t("buttonLabel")}
          </Button>
          <Button disabled data-brand-disabled>
            {t("disabled")}
          </Button>
        </div>
        <Tabs defaultValue="one">
          <TabsList variant="line">
            <TabsTrigger value="one" data-brand-text-role="tab-one">
              {t("firstTab")}
            </TabsTrigger>
            <TabsTrigger value="two" data-brand-text-role="tab-two">
              {t("secondTab")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="one">{t("firstTabContent")}</TabsContent>
          <TabsContent value="two">{t("secondTabContent")}</TabsContent>
        </Tabs>
        <FieldDescription>
          <a href="#brand-text-roles" data-brand-text-role="field-link">
            {t("link")}
          </a>
        </FieldDescription>
        <Accordion defaultValue={["first"]}>
          <AccordionItem value="first">
            <AccordionTrigger>{t("firstSection")}</AccordionTrigger>
            <AccordionContent>
              <a href="#brand-text-roles" data-brand-text-role="accordion-link">
                {t("link")}
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <nav className="visual-stack" aria-label={t("sampleGroup")}>
          <a
            href="#brand-text-roles"
            className="menu-item menu-item-active"
            data-brand-text-role="menu"
          >
            <Icons.PlusIcon className="size-5 menu-item-icon-active" />
            <span>{t("selectedItem")}</span>
          </a>
          <a
            href="#brand-text-roles"
            className="menu-dropdown-item menu-dropdown-item-active"
            data-brand-text-role="submenu"
          >
            {t("selectedItem")}
          </a>
          <a
            href="#brand-text-roles"
            className="docs-menu-item docs-menu-item-active"
            data-brand-text-role="document-menu"
          >
            {t("selectedItem")}
          </a>
          <div className="group visual-row">
            <span
              className="menu-dropdown-badge-pro menu-dropdown-badge-pro-active"
              data-brand-text-role="pro-active"
            >
              {t("selectedItem")}
            </span>
            <span
              className="menu-dropdown-badge-pro menu-dropdown-badge-pro-inactive"
              data-brand-text-role="pro-inactive"
            >
              {t("selectedItem")}
            </span>
          </div>
          <a
            href="#brand-text-roles"
            className="docs-border-item docs-border-item-active"
            data-brand-text-role="document-border"
          >
            {t("selectedItem")}
          </a>
        </nav>
      </div>
    );
  },
};
export const SidebarPrimitives: Story = {
  parameters: { visual: { fullscreen: true } },
  render: function SidebarPrimitivesExample() {
    const t = useTranslations("catalogue");
    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarInput
              aria-label={t("technicalFilter")}
              placeholder={t("sampleFilter")}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t("sampleGroup")}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    {t("selectedItem")}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>{t("secondItem")}</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>{t("technicalFooter")}</SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-6">
            <SidebarTrigger aria-label={t("toggleSidebar")} />
            <p>{t("sidebarComposition")}</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  },
};
export const IconAtlas: Story = {
  render: function IconAtlasExample() {
    return (
      <div className="visual-icon-grid">
        {Object.entries(Icons)
          .filter(
            ([, value]) =>
              typeof value === "function" ||
              (typeof value === "object" &&
                value !== null &&
                "$$typeof" in value),
          )
          .map(([name, value]) => {
            const Icon = value as ComponentType<SVGProps<SVGSVGElement>>;
            return (
              <div className="visual-icon-cell" key={name}>
                <Icon aria-hidden="true" />
                <span>{name}</span>
              </div>
            );
          })}
      </div>
    );
  },
};
// Technical fixture only. Required text is not a product validation rule.
const schema = z.object({
  value: z.string().min(1, "sample_required"),
});
function FormFixture() {
  const t = useTranslations("catalogue");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
  });
  return (
    <form className="visual-stack" noValidate onSubmit={handleSubmit(() => {})}>
      <Field controlId="visual-form-value">
        <FieldLabel>{t("formField")}</FieldLabel>
        <Input
          {...register("value")}
          aria-invalid={Boolean(errors.value)}
          aria-describedby={errors.value ? "visual-form-error" : undefined}
        />
        <FieldError
          id="visual-form-error"
          errors={[
            errors.value
              ? { ...errors.value, message: t("formRequired") }
              : undefined,
          ]}
        />
      </Field>
      <Button type="submit">{t("formSubmit")}</Button>
      <output aria-label={t("formResult")}>
        {isSubmitSuccessful ? t("formComplete") : t("formPending")}
      </output>
    </form>
  );
}
export const Form: Story = {
  render: function FormExample() {
    return <FormFixture />;
  },
};
