import { describe, expect, it } from "vitest";
import { previewProducts } from "../apps/backoffice/.storybook/stories/products-table-model";
import { editingDefaults } from "../apps/backoffice/.storybook/stories/products-editing-model";
import {
  advanceRecovery,
  changeRetention,
  createDraftRecord,
  createRecoveryRecord,
  formerEditorReadOnly,
  receiveRecoveryResult,
  requestDraftEdit,
  resolveDraft,
  reviewDraft,
  startRecoveryRun,
  validateSubmission,
  type SyntheticCommand,
} from "../apps/backoffice/.storybook/stories/products-recovery-model";

const command = (productId = "product-1"): SyntheticCommand => ({
  identity: {
    businessId: "preview-business",
    userId: "preview-user",
    origin: "storybook",
    operationId: `original-${productId}`,
  },
  productId,
  content: { name: "  Café nuevo  " },
});
const product = previewProducts()[0];
const retainedDraft = {
  name: "Café borrador",
  assignSku: false,
  sku: product.sku!,
};

function exhaust() {
  let record = startRecoveryRun(createRecoveryRecord(command()), 0);
  record = advanceRecovery(record, 15_000, () => 0.5);
  record = advanceRecovery(record, 16_000, () => 0.5);
  record = advanceRecovery(record, 31_000, () => 0.5);
  record = advanceRecovery(record, 34_000, () => 0.5);
  return advanceRecovery(record, 49_000, () => 0.5);
}

describe("synthetic unchanged-command recovery", () => {
  it("starts explicitly and freezes a detached original command snapshot", () => {
    const original = command();
    const record = createRecoveryRecord(original);
    original.content.name = "replaced input";
    original.identity.operationId = "replacement";
    expect(record.command.content.name).toBe("  Café nuevo  ");
    expect(Object.isFrozen(record.command.content)).toBe(true);
    expect(record.requests).toHaveLength(0);
    const running = startRecoveryRun(record, 10);
    expect(running.phase).toBe("request");
    expect(running.nextAt).toBe(15_010);
    expect(running.requests).toHaveLength(1);
    expect(running.requests[0].command).toBe(record.command);
  });

  it("uses the selected exact jitter limits for both waits", () => {
    for (const [random, first, second] of [
      [0, 500, 1500],
      [0.5, 1000, 3000],
      [1, 1500, 4500],
    ]) {
      let record = startRecoveryRun(createRecoveryRecord(command()), 0);
      record = advanceRecovery(record, 15_000, () => random);
      expect(record.phase).toBe("waiting");
      expect(record.nextAt).toBe(15_000 + first);
      record = advanceRecovery(record, 15_000 + first, () => random);
      record = advanceRecovery(record, 30_000 + first, () => random);
      expect(record.nextAt).toBe(30_000 + first + second);
    }
  });

  it("exhausts after three requests without calling uncertainty failure or restarting", () => {
    const record = exhaust();
    expect(record.phase).toBe("stopped");
    expect(record.outcome).toBe("unconfirmed");
    expect(record.requests.map((request) => request.startedAt)).toEqual([
      0, 16_000, 34_000,
    ]);
    expect(
      record.requests.every((request) => request.command === record.command),
    ).toBe(true);
    expect(advanceRecovery(record, 1_000_000)).toBe(record);
  });

  it("gives an explicit manual action a new bounded run with the same original command", () => {
    const stopped = exhaust();
    const resumed = startRecoveryRun(stopped, 50_000);
    expect(resumed.run).toBe(2);
    expect(resumed.attempt).toBe(1);
    expect(resumed.requests).toHaveLength(4);
    expect(resumed.requests.at(-1)?.command).toBe(stopped.command);
    expect(startRecoveryRun(resumed, 50_100)).toBe(resumed);
    const exhaustedAgain = advanceRecovery(resumed, 100_000, () => 0.5);
    expect(exhaustedAgain.requests).toHaveLength(6);
    expect(exhaustedAgain.phase).toBe("stopped");
  });

  it("stops automatic recovery on authoritative success or rejection", () => {
    for (const result of ["confirmed", "rejected"] as const) {
      const running = startRecoveryRun(createRecoveryRecord(command()), 0);
      const settled = receiveRecoveryResult(running, result, 100);
      expect(settled.outcome).toBe(result);
      expect(settled.phase).toBe("stopped");
      expect(advanceRecovery(settled, 99_000)).toBe(settled);
      expect(startRecoveryRun(settled, 99_000)).toBe(settled);
    }
  });

  it("does not downgrade authoritative completion when a late unknown result arrives", () => {
    const confirmed = receiveRecoveryResult(
      startRecoveryRun(createRecoveryRecord(command()), 0),
      "confirmed",
      100,
    );
    expect(receiveRecoveryResult(confirmed, "unconfirmed", 200)).toBe(
      confirmed,
    );
  });

  it("restores without dispatch and blocks a known active run elsewhere", () => {
    const restored = createRecoveryRecord(command(), { restored: true });
    expect(restored.requests).toHaveLength(0);
    expect(advanceRecovery(restored, 50_000)).toBe(restored);
    expect(startRecoveryRun(restored, 50_000).requests).toHaveLength(1);
    const elsewhere = createRecoveryRecord(command(), { knownOtherRun: true });
    expect(startRecoveryRun(elsewhere, 0)).toBe(elsewhere);
    const uncoordinated = createRecoveryRecord(command(), {
      knownOtherRun: true,
      coordination: "unavailable",
    });
    expect(startRecoveryRun(uncoordinated, 0).requests).toHaveLength(1);
  });

  it("does not dispatch inaccessible restored history or make storage a gate for known commands", () => {
    const inaccessible = createRecoveryRecord(command(), {
      restored: true,
      historyAccessible: false,
    });
    expect(startRecoveryRun(inaccessible, 0)).toBe(inaccessible);
    const known = createRecoveryRecord(command(), {
      mode: "memory",
      historyAccessible: false,
      retentionProblem: true,
    });
    expect(startRecoveryRun(known, 0).requests).toHaveLength(1);
  });

  it("does not dispatch another retry after learning another run is active", () => {
    const waiting = receiveRecoveryResult(
      startRecoveryRun(createRecoveryRecord(command()), 0),
      "unconfirmed",
      0,
      () => 0.5,
    );
    const elsewhere = { ...waiting, knownOtherRun: true };
    const stopped = advanceRecovery(elsewhere, 1000, () => 0.5);
    expect(stopped.requests).toHaveLength(1);
    expect(stopped.phase).toBe("stopped");
    expect(stopped.outcome).toBe("unconfirmed");
  });

  it("preserves counters, command and confirmed outcomes across retention failures", () => {
    const running = startRecoveryRun(createRecoveryRecord(command()), 0);
    const memory = changeRetention(running, {
      mode: "memory",
      retentionProblem: true,
    });
    expect(memory.command).toBe(running.command);
    expect(memory.run).toBe(running.run);
    expect(memory.nextAt).toBe(running.nextAt);
    const confirmed = receiveRecoveryResult(memory, "confirmed", 10);
    expect(changeRetention(confirmed, { retentionProblem: true }).outcome).toBe(
      "confirmed",
    );
  });
});

describe("new submission remains independent of original recovery", () => {
  it("allows unrelated products while preserving unresolved submitted commands", () => {
    const records = previewProducts();
    const rows = editingDefaults(records);
    rows["product-1"].name = "  Café nuevo  ";
    rows["product-2"].name = "Azúcar nuevo";
    const recovering = startRecoveryRun(createRecoveryRecord(command()), 0);
    const result = validateSubmission(records, rows, [recovering]);
    expect(result.changes).toEqual([{ id: "product-2", name: "Azúcar nuevo" }]);
    expect(result.blocked).toEqual(["product-1"]);
    expect(recovering.requests).toHaveLength(1);
    expect(recovering.command.content.name).toBe("  Café nuevo  ");
  });

  it("sends none of the new set until every detectable field error is corrected", () => {
    const records = previewProducts();
    const rows = editingDefaults(records);
    rows["product-2"].name = " ";
    rows["product-3"].name = "Arroz nuevo";
    const result = validateSubmission(records, rows, []);
    expect(result.changes).toEqual([]);
    expect(result.errors).toMatchObject({ "product-2-name": "blank" });
  });

  it("does not replace newer current data with an older established command result", () => {
    const records = previewProducts().map((entry) =>
      entry.id === "product-1"
        ? { ...entry, name: "Café cambiado después" }
        : entry,
    );
    const rows = editingDefaults(records);
    const confirmed = receiveRecoveryResult(
      startRecoveryRun(createRecoveryRecord(command()), 0),
      "confirmed",
      10,
    );
    expect(validateSubmission(records, rows, [confirmed]).changes).toEqual([]);
  });

  it("does not resend an already confirmed original change", () => {
    const records = previewProducts();
    const rows = editingDefaults(records);
    rows["product-1"].name = "  Café nuevo  ";
    rows["product-2"].name = "Azúcar nuevo";
    const confirmed = receiveRecoveryResult(
      startRecoveryRun(createRecoveryRecord(command()), 0),
      "confirmed",
      10,
    );
    // The UI applies its own confirmed synthetic result to its current catalogue.
    const current = records.map((entry) =>
      entry.id === "product-1" ? { ...entry, name: "  Café nuevo  " } : entry,
    );
    expect(validateSubmission(current, rows, [confirmed]).changes).toEqual([
      { id: "product-2", name: "Azúcar nuevo" },
    ]);
  });
});

describe("retained unsent draft ownership and review", () => {
  it("never starts another editor when an owner is known active", () => {
    const record = createDraftRecord(product, retainedDraft, {
      owner: "active",
    });
    expect(requestDraftEdit(record)).toEqual({ record, reason: "active" });
    expect(resolveDraft(record, "assume")).toBe(record);
    expect(resolveDraft(record, "discard", true)).toBe(record);
  });

  it("offers explicit resolution without assuming an unreachable owner has closed", () => {
    const record = createDraftRecord(product, retainedDraft, {
      owner: "unreachable",
    });
    expect(record.status).toBe("retained");
    expect(requestDraftEdit(record)).toEqual({ record, reason: "unreachable" });
    expect(resolveDraft(record, "cancel")).toBe(record);
    const assumed = resolveDraft(record, "assume");
    expect(assumed.draft).toEqual(retainedDraft);
    expect(assumed.baseline).toEqual(record.baseline);
    expect(assumed.owner).toBe("current");
    expect(assumed.status).toBe("editing");
    expect(formerEditorReadOnly(assumed)).toBe(true);
  });

  it("requires confirmation before abandoning an unsent draft", () => {
    const record = createDraftRecord(product, retainedDraft, {
      owner: "unreachable",
    });
    expect(resolveDraft(record, "discard")).toBe(record);
    const fresh = resolveDraft(record, "discard", true);
    expect(fresh.draft.name).toBe(product.name);
    expect(fresh.draft).toEqual(fresh.current);
    expect(fresh.baseline).toEqual(fresh.current);
    expect(fresh.status).toBe("editing");
    expect(formerEditorReadOnly(fresh)).toBe(true);
  });

  it("requires review only for changed current data and never guesses unavailable data", () => {
    const changed = resolveDraft(
      createDraftRecord(product, retainedDraft, {
        owner: "unreachable",
        comparison: "changed",
        current: { ...retainedDraft, name: "Café actual" },
      }),
      "assume",
    );
    expect(changed.status).toBe("review");
    expect(changed.reviewed).toBe(false);
    expect(reviewDraft(changed).status).toBe("editing");
    expect(reviewDraft(changed).reviewed).toBe(true);
    const unavailable = resolveDraft(
      createDraftRecord(product, retainedDraft, {
        comparison: "unavailable",
        owner: "unreachable",
      }),
      "assume",
    );
    expect(unavailable.status).toBe("unavailable");
    expect(reviewDraft(unavailable)).toBe(unavailable);
  });

  it("cannot resurrect a discarded draft when fresh current data was unavailable", () => {
    const draft = createDraftRecord(product, retainedDraft, {
      owner: "unreachable",
      comparison: "unavailable",
    });
    const discarded = resolveDraft(draft, "discard", true);
    expect(discarded.status).toBe("discarded");
    expect(requestDraftEdit(discarded).reason).toBe("inaccessible");
    expect(resolveDraft(discarded, "assume")).toBe(discarded);
  });

  it("does not falsely assume missing retained work or bypass submitted-product protection", () => {
    const inaccessible = createDraftRecord(product, retainedDraft, {
      owner: "unreachable",
      accessible: false,
    });
    expect(requestDraftEdit(inaccessible).reason).toBe("inaccessible");
    expect(resolveDraft(inaccessible, "assume")).toBe(inaccessible);
    const submitted = createDraftRecord(product, retainedDraft, {
      owner: "unreachable",
      blockedBySubmission: true,
    });
    expect(requestDraftEdit(submitted).reason).toBe("submitted");
    expect(resolveDraft(submitted, "discard", true)).toBe(submitted);
    expect(resolveDraft(submitted, "assume")).toBe(submitted);
  });
});
