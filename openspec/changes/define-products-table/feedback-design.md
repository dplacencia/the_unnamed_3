# Products feedback design discovery

## Authority and starting checkpoint

On 2026-11-16, after the two filters checkpoint commits were verified, root
recommended revisiting the deferred message-box design. The user said
**“go ahead”**. This initiates the design discovery requested under task 9.12;
it does not select an undefined layout or authorize production changes.

Read the [original feedback](recovery-preview-plan.md#user-review--spanish-wording-and-later-message-box-revision)
and the existing [result-presentation rule](specs/products-table/spec.md#requirement-pt-027--dismissible-save-result-presentation).
The prior review explicitly left the affected surfaces, hierarchy, spacing and
treatment open. Clarify the scope and present alternatives before implementation.

Starting HEAD is `3853ee6860cd75eccd95217c001c6d0bd5dd9d80`; the preceding user
commit is `382cfcdbb61ab83aeddb833bb61446cb7d43d236`. Root verified both against
their exact 24/433-file manifests and found the checkpoint clean. Their staging
authority is spent. The accepted baseline contains **912 references**; the
separate **20 navigation revisions** remain unapproved. No staging or commit
follows from this new discovery assignment. Never create commits.

## Current surfaces and observed friction

These are source/approved-image observations, not selected replacement designs.

| Surface                                        | Existing behavior                                                                                                                                                                                                                       | Observed design concern                                                                                                                                         |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EditingResultsView` in `products-editing.tsx` | Shows the table's submitted results or the inspected product's results, including per-field confirmed/failed/unconfirmed outcomes. Detailed results can be hidden and reopened; a new result set is not hidden by an earlier dismissal. | Product name, SKU, submitted value and outcome stack into repeated lines. A small result set already takes substantial space above the table.                   |
| Recovery summary in `products-recovery.tsx`    | Shows known recovery state, individual original-command actions, restored-draft information and capability/ownership notes. Its global uncertainty remains available when a product is filtered out.                                    | Long headline, repeated row status and vertically stacked notes compete with the table. The X icon remains an X when its action is to reopen collapsed details. |
| Existing compact row markers                   | Preserve row identity/editor width and expose state through tint, an independent marker and accessible explanation.                                                                                                                     | These were specifically selected and approved; the message redesign must not reintroduce inline status text beside product names.                               |

Read-only inspection included the accepted phone image
`visual/references/mobile/products-recovery-exhausted-default--mobile.png` and
the current editing/recovery component sources. Independent review also inspected
the mixed-results and recovery-editing examples. Approximate heights are evidence
of current space consumption, not selected new dimensions or performance claims.

The retained TailAdmin `Alert` and `Collapsible` primitives are available. Alert's
default announcement role is `alert`; reuse must preserve the appropriate known
status/error semantics instead of making all routine results assertive. No new
component dependency or global notification architecture is selected.

## Preserved functional constraints

- Confirmed success, confirmed rejection/failure, an active check and unresolved
  outcome remain distinct. A local retention problem does not reverse a known
  business result. Unknown state never becomes an inferred success or failure.
- Preserve per-product and per-field outcomes, exact submitted text and product
  disambiguation. A partially successful product must not be called wholly saved
  merely to simplify a summary count.
- Hiding detailed presentation changes visibility only. Keep results inspectable,
  uncertainty visible and affected-product protections intact. A previous
  dismissal must not conceal a later result set under PT-027.
- Browsing and eligible unrelated editing/saving remain available. Filtering
  a row away does not erase its draft, command or unresolved outcome.
- Existing retry/continue actions retain their original command identity/content,
  eligibility and bounded-run behavior. Visibility, expansion or focus alone does
  not restart a run or resolve an ownership conflict.
- Keep Spanish phrasing about **los cambios** and use **guardar** verbally in this
  context. The user's accepted uncertainty sentence remains the reference:
  “No hemos podido confirmar que los cambios se han guardado.”
- Preserve keyboard/touch access, recognizable action affordances, focus return,
  non-colour status information, five-language examples and appropriate status
  announcements. Existing 44px phone targets remain applicable.

## Selected scope — 2026-11-16

The user selected **“Save results + recovery status (Recommended)”** after root
recommended redesigning Products' save-result and recovery-status boxes together.
This settles the affected surfaces. Field validation, confirmation dialogs and a
general storage/access-notification system remain separate. Existing embedded
recovery limitations still need truthful presentation; their semantics are not
removed. Do not repeat the scope question.

The selection does not choose a replacement layout or merge the two surfaces'
underlying result/recovery state. Presentation must preserve each surface's
current table/product scope and command/result identity.

## Layout alternatives — proposed for selection

| Direction                                                           | Concrete treatment                                                                                                                                                                           | Benefit and trade-off                                                                                                                                                                               |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Compact inline summary with expandable details — recommended** | Reuse one presentation pattern in both scoped surfaces: a short status header with an explicit disclosure action, and compact product outcome/action rows directly underneath when expanded. | Keeps status and the working table together, reduces repeated text and uses space deliberately. Details can still grow for a long result set; exact dimensions/copy remain visual review proposals. |
| **B. Tighter versions of the current cards**                        | Keep the current box arrangement, improve hierarchy and row alignment, remove repetition and correct the close/reopen affordance.                                                            | Smallest interaction change, but large result sets and embedded notes still occupy considerable vertical space.                                                                                     |
| **C. Compact summary opening a dedicated status panel**             | Keep a small status summary above the table and show detailed results/actions in a separate panel.                                                                                           | Recovers the most table space, but adds another inspection destination beside the existing product panel and needs further panel/focus/navigation decisions.                                        |

All alternatives preserve current save/recovery behavior and PT-027's detailed
presentation dismissal/reopen/new-result rules. Direction A is a proposed visual
structure, not a new default that silently hides new results. A disclosure should
look and be labelled as a disclosure rather than retain an X whose action is to
reopen details. Product identity, per-field results and eligible command actions
remain available in context.

Do not introduce global retry actions, a merged result model, inferred success
counts, auto-dismissal, a different initial expansion policy or a global
notification system through this layout choice. If an alternative would require
one of those changes, bring the concrete decision back to the user first.

## Selected direction and preview authority — 2026-11-16

The user selected **“Compact inline summary + expandable details (Recommended)”**
in response to which layout should be developed in the **simulated Storybook
preview**. Direction A is selected. The question explicitly retained existing
save, retry, dismissal and new-result behavior. This authorizes the bounded
[preview implementation plan](feedback-preview-plan.md), not a merged state model,
production implementation, new dependencies or acceptance of future images.

Reuse a consistent compact presentation for the two scoped surfaces. Keep their
state sources distinct, preserve current initial/new-result visibility rules and
available per-command actions, and use an actual disclosure affordance. Exact
spacing, colour treatment and responsive arrangement are review proposals.

No accepted image, dependency, production route/API, journal, ownership mechanism
or retry policy changes through this selection. New candidates require specific
approval; no staging or commit follows.

## Visual review acceptance — 2026-11-16

The user replied **“that looks ok”** to the exact 164-image completed feedback
revision. The [approval/promotion record](feedback-preview-plan.md#visual-approval-and-reference-promotion--2026-11-16)
identifies the gallery, source and preserved reference scope. This accepts that
specific visual treatment; future revisions still require their own approval.
It grants no staging, commit or broader product/production authority.
