import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useLocale } from "next-intl";
import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { defaultLocale, isLocale } from "@/i18n/configuration";
import { employeeCredentialMessages } from "./core-employee-credentials-messages";
import { CoreEmployeeCredentialsPanel } from "./core-employee-credentials-preview";
import { NavigationPrototype } from "./navigation-prototype";

function CredentialsStory(
  args: ComponentProps<typeof CoreEmployeeCredentialsPanel>,
) {
  const language = useLocale();
  const t = employeeCredentialMessages(
    isLocale(language) ? language : defaultLocale,
  );
  const [open, setOpen] = useState(true);

  return (
    <NavigationPrototype
      initialPage="business-settings"
      permissionMode="ready"
      locationCount="one"
      businessSettingsContent={
        <>
          {!open && (
            <div className="grid justify-items-start gap-2">
              <p>{args.employeeName}</p>
              <Button type="button" size="sm" onClick={() => setOpen(true)}>
                {t("title")}
              </Button>
            </div>
          )}
          <div hidden={!open}>
            <CoreEmployeeCredentialsPanel
              {...args}
              onBack={() => setOpen(false)}
            />
          </div>
        </>
      }
    />
  );
}

const meta = {
  title: "Core/Employee credentials",
  component: CoreEmployeeCredentialsPanel,
  args: {
    employeeName: "Ada Vega",
    grants: { password: true, mfa: true, security: true },
    onBack: () => undefined,
    fixture: "actions",
  },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Synthetic employee credentials panel. The example value is a placeholder, not a usable password. Password reset, assisted MFA reset and security recovery have separate outcomes. The story never calls a provider or stores a password.",
      },
    },
  },
  render: (args) => <CredentialsStory key={args.fixture} {...args} />,
} satisfies Meta<typeof CoreEmployeeCredentialsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {};
export const PasswordChoice: Story = { args: { fixture: "password-choice" } };
export const PasswordHandoff: Story = { args: { fixture: "password-handoff" } };
export const MfaInitiated: Story = { args: { fixture: "mfa-initiated" } };
export const SecurityLocked: Story = { args: { fixture: "security-locked" } };
export const SecurityUncertain: Story = {
  args: { fixture: "security-uncertain" },
};
export const SecurityComplete: Story = {
  args: { fixture: "security-complete" },
};
