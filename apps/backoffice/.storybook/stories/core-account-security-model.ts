export type RecoveryStatus =
  | "pending"
  | "action_required"
  | "support_required"
  | "completed"
  | "unavailable";

export function recoveryStatus(value: unknown): RecoveryStatus {
  switch (value) {
    case "pending":
    case "action_required":
    case "support_required":
    case "completed":
      return value;
    default:
      return "unavailable";
  }
}

export type MerchantMfaPolicy =
  | { enabled: false }
  | { enabled: true; since: string; until: string; graceDays?: number };

export type MerchantMfaChange =
  | { enabled: false }
  | { enabled: true; days: string }
  | { enabled: true; until: string };

export const fixtureToday = "2026-11-20";
const dayInMilliseconds = 86_400_000;

function shiftFixtureDate(date: string, days: number) {
  return new Date(Date.parse(date) + days * dayInMilliseconds)
    .toISOString()
    .slice(0, 10);
}

export function merchantMfaChange(
  current: MerchantMfaPolicy,
  change: MerchantMfaChange,
  freshMfaConfirmed: boolean,
): MerchantMfaPolicy | null {
  if (!freshMfaConfirmed) return null;
  if (!change.enabled) return { enabled: false };

  if ("days" in change) {
    if (current.enabled || !/^(?:[1-9]|[1-5][0-9]|60)$/.test(change.days)) {
      return null;
    }
    const graceDays = Number(change.days);
    return {
      enabled: true,
      since: fixtureToday,
      until: shiftFixtureDate(fixtureToday, graceDays),
      graceDays,
    };
  }

  const { until } = change;
  const instant = Date.parse(until);
  if (
    !current.enabled ||
    current.until <= fixtureToday ||
    !/^\d{4}-\d{2}-\d{2}$/.test(until) ||
    !Number.isFinite(instant) ||
    new Date(instant).toISOString().slice(0, 10) !== until ||
    until <= fixtureToday ||
    until > shiftFixtureDate(current.since, 60)
  ) {
    return null;
  }
  return { enabled: true, since: current.since, until };
}
