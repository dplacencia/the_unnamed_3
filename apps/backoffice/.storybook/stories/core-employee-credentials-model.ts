export type EmployeeCredentialAction = "password" | "mfa" | "security";
export type EmployeeCredentialGrants = Readonly<
  Record<EmployeeCredentialAction, boolean>
>;
export type PasswordSessionChoice = "keep" | "sign-out";
export type CoreEmployeeCredentialsFixture =
  | "actions"
  | "password-choice"
  | "password-handoff"
  | "mfa-initiated"
  | "security-locked"
  | "security-uncertain"
  | "security-complete";

type SecurityRecovery = Readonly<{
  view: "security-locked" | "security-uncertain" | "security-complete";
  reference: string;
}>;

export type CredentialPreviewState =
  | { view: "actions" }
  | { view: "password-choice" }
  | { view: "password-handoff"; sessions: PasswordSessionChoice }
  | { view: "mfa-choice" }
  | { view: "mfa-initiated" }
  | { view: "security-choice" }
  | SecurityRecovery;

const recoveryFixture = "employee-security-reset-example";

export function credentialFixture(
  fixture: CoreEmployeeCredentialsFixture,
): CredentialPreviewState {
  switch (fixture) {
    case "password-handoff":
      return { view: "password-handoff", sessions: "sign-out" };
    case "security-locked":
    case "security-uncertain":
    case "security-complete":
      return { view: fixture, reference: recoveryFixture };
    default:
      return { view: fixture };
  }
}

export function confirmCredentialAction(
  grants: EmployeeCredentialGrants,
  action: EmployeeCredentialAction,
  sessions: PasswordSessionChoice | null,
): CredentialPreviewState | null {
  if (!grants[action]) return null;
  switch (action) {
    case "password":
      return sessions ? { view: "password-handoff", sessions } : null;
    case "mfa":
      return { view: "mfa-initiated" };
    case "security":
      return { view: "security-locked", reference: recoveryFixture };
  }
}

export function reconcileEmployeeSecurityReset(
  grants: EmployeeCredentialGrants,
  state: CredentialPreviewState,
): CredentialPreviewState {
  if (!grants.security || state.view !== "security-uncertain") return state;
  return { view: "security-complete", reference: state.reference };
}
