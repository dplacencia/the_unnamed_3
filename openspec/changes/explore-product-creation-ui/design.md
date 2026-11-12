# Product-creation comparison

## Approved basis

The user authorized this comparison in the [proposal](proposal.md#authority-and-status).
Foundation U17 selects simple by default and user-requested complexity. U2 makes
TailAdmin the required backoffice starting point. Spanish is the main/default
language, and Irin remains a provisional name. No new product decision is adopted.

## Sources and applicability

Read-only inputs:

- [Product identity](../../../../the_unnamed_1/openspec/specs/inventory-product-identity-lifecycle/spec.md):
  a valid supplied nonunique name is required; initial codes are optional where
  supported. Names and codes retain their exact-text rules.
- [Quantity rules](../../../../the_unnamed_1/openspec/specs/inventory-quantities/spec.md):
  exact quantities, compatible units, whole pieces, six decimal places and initial
  unit increments. No automatic rounding to fit configuration.
- [Measurement contract](../../../../the_unnamed_1/openspec/specs/inventory-quantity-contract/spec.md#requirement-measurement-configuration-and-supplied-increments):
  decimal precision derives from the increment; it is not independently editable.
- [Wire schema](../../../../the_unnamed_1/inventory/contract/proto/inventory/v1/inventory.proto):
  `CreateProductRequest` includes name, dimension, base unit, increment and codes.

The defined full product differs from the available local backend profile.
Optional codes illustrate defined behavior, not its current local standalone/no-code
availability. This is not a serializer or complete contract validator. Prices,
stock, suppliers, photos, packages and variants are outside this comparison.
Product creation itself does not record initial stock.

TailAdmin source inspected directly inside `tailadmin-nextjs-pro-2.5.zip`, rooted
at `tailadmin-nextjs-pro-main/`:

- `AGENTS.md`: component/form conventions, read before adaptation.
- `src/components/common/component-card.tsx`: separated title/body, 16px card
  corners and 24px desktop padding.
- `src/components/ui/input.tsx`: 44px controls, 10px corners, 14px text and focus/
  invalid states.
- `src/components/ui/button.tsx`: default, outline and link hierarchy.
- `src/components/ui/field.tsx`: labels, descriptions and field grouping.
- `src/app/globals.css`: blue brand tokens, Outfit declaration, light/dark conventions.

The fragment adapts that anatomy and styling to native HTML for conversation
review. It does not run React/Base UI, select a production framework or extract
the full kit. Template blue is not an approved Irin color; system font fallback
avoids a network dependency and does not select final typography.

## Exploration choices and review status

The revised presentation concept is accepted as a design reference, as recorded
below. Other choices in this exploration remain proposals unless separately
approved; acceptance of the comparison is not blanket approval of every detail.

- Compare two views of one shared synthetic draft. The simple view starts with
  extra fields collapsed; the right view is expanded for immediate comparison.
- Name and measurement unit remain explicit. “Tomate pera” and kilogram are labelled
  example data, not guessed production defaults.
- Expand advanced options inside the current task. This is a proposed mechanism,
  not a choice of permanent tier count, global mode, roles or preferences.
- Expose optional SKU, one illustrative barcode field and an editable increment.
  Derived precision is informational. Full multiple-code editing is not designed.
- Collapsing preserves values. Following the user's feedback below, the simple
  view keeps the detailed configuration summary inside advanced options. Invalid
  configuration still blocks review and exposes the fields needing correction.
- Selecting a different unit initializes its documented increment; the selector
  explains this effect. Production treatment needs user review. Units are never
  inferred from names. Count uses whole pieces.
- “Revisar borrador” displays the draft only. It never claims creation, saving,
  identifier uniqueness or server validation.
- Optional review controls compare comfortable/compact spacing without adopting
  a final density or automatically changing depth.

Decimal handling uses strings and BigInt, accepting Spanish comma or dot entry.
It never rounds through binary floating point. Derived precision ignores only
equivalent trailing zeros; the typed increment string remains in the draft.

## Review questions and limits

### User feedback: remove advanced information from the simple view

The user said: “The viste simple includes a text box with information that is
advanced, like the steps. That may be too much for simple people. Complex view
looks ok”. This authorizes simplifying the displayed information; the advanced
concept is positively received, without approving production architecture,
branding or every unresolved interaction.

The revision moves the entire quantity/code summary into the simple panel's
collapsed advanced section. The default form shows the product name, measurement
unit, an optional advanced action and draft review. Its helper and unit-change
announcement use everyday language without explaining increments. The default
review also omits the increment row; expanded-view review retains it. Values and
validation remain shared and exact. The advanced panel's markup is unchanged.

This replaces the earlier proposal to always show custom increments in simple
mode. Honesty does not require continuously displaying all technical settings:
they remain inspectable on request, and errors still prevent an invalid draft
from being reviewed as ready. No broader tier/global-mode decision is inferred.

### Remaining questions

Primary question: should advanced options expand inside the task, or should there
be an explicit interface-wide mode? Branding, copy, density, full code editing,
five-language translation and persistence remain open. Inline-host restoration is
review state only, not a proposed account preference or saved product.

### Acceptance of the revised concept

After the assistant presented the revised comparison and explained that the simple
view contains the name and measurement unit while technical details appear only
on request, the user replied: “That looks ok”. Record this as acceptance of that
revised presentation concept for design reference, together with the earlier
positive feedback on the advanced view. Both views continue to use the same draft.

This acceptance does not select an interface-wide mode, persistence policy, final
brand identity or production architecture, and does not authorize implementation,
deployment, archival or a commit. The prototype itself is unchanged by recording
this acceptance. Existing verification limits remain in force.

No network/backend calls are made. Browser access was unavailable in this session.
Layout, theme contrast, keyboard behavior and host integration cannot be claimed
as browser-verified. No independent review is claimed.

## Verification

Initial self-checks completed on 2026-11-11 (before the feedback revision):

- Native `openspec validate --all --strict --no-interactive`: both changes passed,
  zero failures; this change's no-spec-delta marker was explicitly accepted.
- Fragment parser: balanced markup, 29 unique IDs, 10 labels and 18 accessibility
  references, all resolving. No document wrapper or network APIs. Source under 25 KB.
- `node --check` passed. An ephemeral Node DOM-stub harness executed the actual
  fragment script: shared edits, exact name/leading-zero code preservation,
  expansion/collapse without resets, custom and empty increments, six-decimal
  boundary without rounding, whole pieces, comma/dot entry, integer values above
  JavaScript's safe numeric range, text insertion, code-byte limits and host-state
  restoration passed. This is logic verification, not a browser test or complete
  contract conformance test.
- The visualize standalone wrapper rendered to a temporary local preview file.
  It warned about host-state API references; the fragment uses only the supported
  widget state methods, with snapshots capped below 16 KiB. No site was published.
- Browser inventory returned “browser access host is unavailable”; no screenshot,
  rendered layout, focus order, theme contrast or visual acceptance is claimed.
- Ten Markdown files checked, 29 local links resolved, all 28 foundation requirement
  IDs remained unique and no trailing whitespace was found.
- Both archives retained their original byte sizes and observed modification times:
  Figma 324850588 bytes / `1794400799509809222` ns; code 9048744 bytes /
  `1794400760207282688` ns. No archive extraction or package installation occurred.
- Git index remained empty and reachable commit count remained zero.

These checks complete [tasks.md](tasks.md); they do not imply user acceptance,
independent review or authorization to implement the proposed app behavior.

### Feedback revision checks

- A fresh balanced-markup/ID/reference check passed: 29 unique IDs, 10 labels and
  18 accessibility references, all resolving. Parsed advanced-panel markup matched
  the initial snapshot exactly.
- JavaScript syntax and all prior local script scenarios passed. Additional DOM-stub
  checks confirmed no steps, increment, precision or SKU explanation in the collapsed
  simple form; advanced details available on request; custom increments/codes retained
  through collapse; simple review hides the increment while expanded review shows it;
  simple unit announcements omit technical details; invalid increments still block
  review and open the fields for correction without changing the entered value.
- Native strict validation passed again for both changes, zero failures. Browser
  rendering was not verified; the earlier browser-availability limit still applies.

This is a revision of the review concept, not an implemented backoffice feature.
