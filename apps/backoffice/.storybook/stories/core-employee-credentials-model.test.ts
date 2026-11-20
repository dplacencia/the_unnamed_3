import { describe, expect, it } from "vitest";
import {
  credentialFixture,
  confirmCredentialAction,
  reconcileEmployeeSecurityReset,
} from "./core-employee-credentials-model";

const grants = { password: true, mfa: true, security: true };

describe("employee credentials review", () => {
  it("requires an explicit choice before displaying a normal temporary-password handoff", () => {
    expect(confirmCredentialAction(grants, "password", null)).toBeNull();
    expect(confirmCredentialAction(grants, "password", "keep")).toEqual({
      view: "password-handoff",
      sessions: "keep",
    });
    expect(confirmCredentialAction(grants, "password", "sign-out")).toEqual({
      view: "password-handoff",
      sessions: "sign-out",
    });
  });

  it("requires the proper permission for each action", () => {
    expect(
      confirmCredentialAction(
        { ...grants, password: false },
        "password",
        "keep",
      ),
    ).toBeNull();
    expect(
      confirmCredentialAction({ ...grants, mfa: false }, "mfa", null),
    ).toBeNull();
    expect(
      confirmCredentialAction({ ...grants, security: false }, "security", null),
    ).toBeNull();
  });

  it("keeps MFA replacement separate from password issuance and a security lock", () => {
    expect(confirmCredentialAction(grants, "mfa", null)).toEqual({
      view: "mfa-initiated",
    });
  });

  it("reconciles the same locked recovery only with currently granted security-reset authority", () => {
    const uncertain = credentialFixture("security-uncertain");
    expect(uncertain.view).toBe("security-uncertain");
    if (uncertain.view !== "security-uncertain")
      throw new Error("Missing fixture");
    expect(
      reconcileEmployeeSecurityReset({ ...grants, security: false }, uncertain),
    ).toEqual(uncertain);
    expect(reconcileEmployeeSecurityReset(grants, uncertain)).toEqual({
      view: "security-complete",
      reference: uncertain.reference,
    });
  });

  it("keeps actual credentials out of the retained preview state", () => {
    expect(credentialFixture("password-handoff")).toEqual({
      view: "password-handoff",
      sessions: "sign-out",
    });
    expect(credentialFixture("security-locked")).toMatchObject({
      view: "security-locked",
    });
  });
});
