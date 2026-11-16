import {
  changedProducts,
  editingDefaults,
  validateEditingText,
  type EditingDraft,
  type EditingRows,
  type ProductChange,
} from "./products-editing-model";
import type { PreviewProduct } from "./products-table-model";

// Synthetic Storybook snapshots only: this is not an Inventory RPC schema.
export type SyntheticCommand = {
  identity: {
    businessId: string;
    userId: string;
    origin: string;
    operationId: string;
  };
  productId: string;
  content: { name?: string; sku?: string };
};
type FrozenCommand = {
  readonly identity: Readonly<SyntheticCommand["identity"]>;
  readonly productId: string;
  readonly content: Readonly<SyntheticCommand["content"]>;
};
export type RetentionMode = "indexeddb" | "localstorage" | "memory";
export type RecoveryOptions = {
  mode?: RetentionMode;
  restored?: boolean;
  historyAccessible?: boolean;
  retentionProblem?: boolean;
  knownOtherRun?: boolean;
  coordination?: "available" | "unavailable";
};
export type RecoveryOutcome = "unconfirmed" | "confirmed" | "rejected";
export type RecoveryRequest = {
  run: number;
  attempt: number;
  startedAt: number;
  deadline: number;
  command: FrozenCommand;
};
export type RecoveryRecord = Required<RecoveryOptions> & {
  command: FrozenCommand;
  productId: string;
  outcome: RecoveryOutcome;
  phase: "idle" | "request" | "waiting" | "stopped";
  run: number;
  attempt: number;
  nextAt: number | null;
  requests: RecoveryRequest[];
};
export type DraftRecord = {
  productId: string;
  baseline: EditingDraft;
  draft: EditingDraft;
  current: EditingDraft;
  owner: "current" | "active" | "unreachable" | "none";
  accessible: boolean;
  comparison: "changed" | "unchanged" | "unavailable";
  status: "retained" | "editing" | "review" | "unavailable" | "discarded";
  reviewed: boolean;
  ownershipChanged: boolean;
  blockedBySubmission: boolean;
};
export type DraftOptions = Partial<
  Pick<
    DraftRecord,
    "owner" | "accessible" | "comparison" | "current" | "blockedBySubmission"
  >
>;
export type DraftEditReason =
  "active" | "unreachable" | "inaccessible" | "submitted" | null;

export function createRecoveryRecord(
  command: SyntheticCommand,
  options: RecoveryOptions = {},
): RecoveryRecord {
  const snapshot = Object.freeze({
    identity: Object.freeze({ ...command.identity }),
    productId: command.productId,
    content: Object.freeze({ ...command.content }),
  });
  return {
    command: snapshot,
    productId: command.productId,
    outcome: "unconfirmed",
    phase: "idle",
    run: 0,
    attempt: 0,
    nextAt: null,
    requests: [],
    mode: options.mode ?? "indexeddb",
    restored: options.restored ?? false,
    historyAccessible: options.historyAccessible ?? true,
    retentionProblem: options.retentionProblem ?? false,
    knownOtherRun: options.knownOtherRun ?? false,
    coordination: options.coordination ?? "available",
  };
}

function dispatch(record: RecoveryRecord, now: number): RecoveryRecord {
  const attempt = record.attempt + 1;
  const deadline = now + 15_000;
  return {
    ...record,
    attempt,
    phase: "request",
    nextAt: deadline,
    requests: [
      ...record.requests,
      {
        run: record.run,
        attempt,
        startedAt: now,
        deadline,
        command: record.command,
      },
    ],
  };
}

export function startRecoveryRun(
  record: RecoveryRecord,
  now: number,
): RecoveryRecord {
  if (
    record.outcome !== "unconfirmed" ||
    record.phase === "request" ||
    record.phase === "waiting" ||
    (record.knownOtherRun && record.coordination === "available") ||
    (record.restored && !record.historyAccessible)
  )
    return record;
  return dispatch(
    { ...record, run: record.run + 1, attempt: 0, restored: false },
    now,
  );
}

function scheduleRetry(
  record: RecoveryRecord,
  now: number,
  random: () => number,
): RecoveryRecord {
  if (
    record.attempt >= 3 ||
    (record.knownOtherRun && record.coordination === "available")
  )
    return { ...record, phase: "stopped", nextAt: null };
  const nominal = record.attempt === 1 ? 1000 : 3000;
  const sample = Math.max(0, Math.min(1, random()));
  return {
    ...record,
    phase: "waiting",
    nextAt: now + nominal * (0.5 + sample),
  };
}

// The injected timestamp drives a virtual clock; no API request or timer is created.
export function advanceRecovery(
  record: RecoveryRecord,
  now: number,
  random = Math.random,
): RecoveryRecord {
  let next = record;
  while (
    next.nextAt !== null &&
    next.nextAt <= now &&
    next.outcome === "unconfirmed"
  ) {
    const at = next.nextAt;
    if (next.phase === "request") next = scheduleRetry(next, at, random);
    else if (next.phase === "waiting")
      next =
        next.knownOtherRun && next.coordination === "available"
          ? { ...next, phase: "stopped", nextAt: null }
          : dispatch(next, at);
    else break;
  }
  return next;
}

export function receiveRecoveryResult(
  record: RecoveryRecord,
  result: RecoveryOutcome,
  now: number,
  random = Math.random,
): RecoveryRecord {
  if (record.outcome !== "unconfirmed" || !record.requests.length)
    return record;
  if (result !== "unconfirmed")
    return { ...record, outcome: result, phase: "stopped", nextAt: null };
  return record.phase === "request"
    ? scheduleRetry(record, now, random)
    : record;
}

export function changeRetention(
  record: RecoveryRecord,
  options: Partial<
    Pick<RecoveryOptions, "mode" | "historyAccessible" | "retentionProblem">
  >,
): RecoveryRecord {
  return { ...record, ...options };
}

export function createDraftRecord(
  product: PreviewProduct,
  draft: EditingDraft,
  options: DraftOptions = {},
): DraftRecord {
  const baseline = editingDefaults([product])[product.id];
  return {
    productId: product.id,
    baseline,
    draft: { ...draft },
    current: { ...(options.current ?? baseline) },
    owner: options.owner ?? "none",
    accessible: options.accessible ?? true,
    comparison: options.comparison ?? "unchanged",
    status: "retained",
    reviewed: false,
    ownershipChanged: false,
    blockedBySubmission: options.blockedBySubmission ?? false,
  };
}
export function requestDraftEdit(record: DraftRecord): {
  record: DraftRecord;
  reason: DraftEditReason;
} {
  const reason = record.blockedBySubmission
    ? "submitted"
    : record.owner === "active"
      ? "active"
      : !record.accessible || record.status === "discarded"
        ? "inaccessible"
        : record.owner === "unreachable"
          ? "unreachable"
          : null;
  if (reason) return { record, reason };
  return {
    record: {
      ...record,
      owner: "current",
      status:
        record.comparison === "unavailable"
          ? "unavailable"
          : record.comparison === "changed" && !record.reviewed
            ? "review"
            : "editing",
    },
    reason: null,
  };
}

export function resolveDraft(
  record: DraftRecord,
  action: "assume" | "discard" | "cancel",
  confirmed = false,
): DraftRecord {
  if (
    action === "cancel" ||
    record.blockedBySubmission ||
    !record.accessible ||
    record.status === "discarded" ||
    record.owner === "active"
  )
    return record;
  if (action === "discard") {
    if (!confirmed) return record;
    if (record.comparison === "unavailable")
      return {
        ...record,
        owner: "none",
        status: "discarded",
        accessible: false,
        ownershipChanged: true,
      };
    return {
      ...record,
      owner: "current",
      status: "editing",
      baseline: { ...record.current },
      draft: { ...record.current },
      comparison: "unchanged",
      reviewed: false,
      ownershipChanged: true,
    };
  }
  return {
    ...record,
    owner: "current",
    ownershipChanged: true,
    status:
      record.comparison === "unavailable"
        ? "unavailable"
        : record.comparison === "changed"
          ? "review"
          : "editing",
    reviewed: false,
  };
}

export function reviewDraft(record: DraftRecord): DraftRecord {
  if (
    record.status !== "review" ||
    record.comparison !== "changed" ||
    record.blockedBySubmission ||
    !record.accessible
  )
    return record;
  return { ...record, reviewed: true, status: "editing" };
}

export function formerEditorReadOnly(record: DraftRecord): boolean {
  return record.ownershipChanged || record.blockedBySubmission;
}

export function validateSubmission(
  records: PreviewProduct[],
  rows: EditingRows,
  recoveries: RecoveryRecord[],
): {
  changes: ProductChange[];
  errors: Record<string, string>;
  blocked: string[];
} {
  // Supplied records are current fixture data. Replaying an established command
  // result does not prove those original values are still the current product.
  const pending = new Set(
    recoveries
      .filter((record) => record.outcome === "unconfirmed")
      .map((record) => record.productId),
  );
  const requested = changedProducts(records, rows);
  const blocked = requested
    .filter((change) => pending.has(change.id))
    .map((change) => change.id);
  const eligible = requested.filter((change) => !pending.has(change.id));
  const errors: Record<string, string> = {};
  for (const change of eligible) {
    for (const field of ["name", "sku"] as const) {
      const value = change[field];
      if (value === undefined) continue;
      const error = validateEditingText(field, value);
      if (error) errors[`${change.id}-${field}`] = error;
    }
  }
  return {
    changes: Object.keys(errors).length ? [] : eligible,
    errors,
    blocked,
  };
}
