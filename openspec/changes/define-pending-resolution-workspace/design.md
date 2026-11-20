# Pending resolution workspace

## Source and scope

The user authorized continuing the frontend views and specifications
autonomously and explicitly included Pending resolution in the November 30
review. The review builds on the approved
[Pendientes list](../define-pending-movements-browsing/specs/pending-movements-browsing/spec.md)
and [Salida inspector](../define-pending-departure-inspection/specs/pending-departure-inspection/spec.md).
The three mutation paths follow Inventory's original-effect and recovery
rules. Storybook supplies fixtures for these paths.
[Native method contracts](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-five-method-request-and-result-boundary)

## Selected review examples

- **Release one line.** An originally Pending Salida has an exact saved
  quantity and a missing channel. Select the actual enabled channel from
  the fixture and explicitly confirm release. Render the exact signed effect
  from the reply. Preserve the original quantity and distinguish current
  rejection after overflow from a refusal of the attempted command.
  [Corrections](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-actual-correction-inputs-and-prerequisites) ·
  [Release outcomes](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-release-validity-and-distinct-original-outcomes)
- **Reject one receipt.** Require explicit confirmation that the supplier's
  goods never arrived and capture the merchant's reason exactly. Show the
  original receipt's retained rejection and the absence of a stock effect.
  [Supplier receipt rejection](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-supplier-receipt-rejection)
- **Release a partially arrived receipt.** Keep the saved quantity and unit
  visible. Require the smaller exact quantity that arrived under the existing
  product rules and an explicit confirmation. The fixture records a
  value-only correction. Its confirmed effect uses the original unit.
- **Cancel a whole duplicate.** Require the trusted, inspectable same-kind
  counterpart and all still-Pending target lines. Show the two batches and the
  complete affected line list. Capture the caller's reason and apply the decision only
  to the whole target. Display a single generic counterpart-unavailable notice
  when its identity cannot be safely used.
  The selection example supplies two already-authorized counterpart identities
  from a synthetic source. The merchant selects and confirms one before dispatch.
  [Duplicate eligibility](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-whole-confirmed-duplicate-batch-cancellation)
- **Confirm an uncertain outcome.** Retain the complete original command,
  including its operation ID and exact text. Retry that object under current
  authority. A safe access denial leaves the originally uncertain outcome
  unresolved. Use the retained result to update the list and show any effect.
  [Retry and competing resolution contract](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-competing-commands-and-current-authorized-retries)

## Dependencies for live use

The public browser gateway currently omits Pending discovery, inspection and
the three resolution commands. A20 also deliberately omits related-batch
identity and broader counterpart access. Live whole-batch cancellation needs
an authorized way to obtain both complete identities, whole-target status and
usable counterpart facts. The prepared fixture is an example of such inputs.
[Gateway boundary](../define-pending-movements-browsing/design.md#browser-gateway-source-evidence) ·
[Exact inspection boundary](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-pending-discovery-and-originally-pending-detail)

The preview supports a missing departure channel and a value-only correction
for a partially arrived receipt. Wider release screens depend on an authorized source of permitted
correction choices, grants and current configuration. Separate report
approval and explicit approximation retain their native applicability.
Their presentation and real transport remain open.
[Approval interfaces](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution-contract/spec.md#requirement-separate-report-approximation-and-self-approval-interfaces)

## Review and verification

Reuse the navigation, list and inspection components with a responsive sheet
for the three explicit review actions. Review the missing-channel release,
never-arrived receipt, whole-batch cancellation, unconfirmed release, retained
effect and unavailable counterpart states in the existing four profiles. Use
the five supported locales and exercise the review, return and retry actions.
