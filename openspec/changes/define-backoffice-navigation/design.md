# Backoffice navigation discovery

## User instruction and scope

After the user committed the approved branding batch, the agent proposed product
creation as the next flow and offered navigation/module structure or the landing
brief as alternatives. The user selected **“Backoffice navigation and module
structure”**. Start with the merchant's navigation model and functional grouping.
The previously accepted product-creation comparison remains a later design
reference, not the selected first task.

The existing instruction to record definitions in OpenSpec remains applicable.
Undefined choices require the user's answer. This is frontend discovery in this
repository; sibling sources are read-only context. No sibling role assignment,
new service architecture, launch commitment or backend integration follows.

## Inherited decisions

Read the foundation's [scope](../establish-frontend-foundation/specs/frontend-scope/spec.md),
[values](../establish-frontend-foundation/specs/product-values/spec.md) and
[authority/workflow](../establish-frontend-foundation/specs/specification-workflow/spec.md).

- The backoffice serves merchant teams, including beginners and advanced users.
- Everyday use is simple by default; users explicitly request greater depth.
- Modules provide independent value and support growth at the customer's pace.
- Known status and availability must be represented honestly.
- Human help is available on request; assistance channels are not selected here.
- The five languages, retained TailAdmin treatment and approved initial Irin
  branding remain in place. Irin is still a provisional name.

The approved feature-folder organization is code organization, not an adopted
customer-facing module menu. User role, interface depth and purchased module
access remain distinct concepts; their navigation behavior needs definition.

## Source findings and limits

| Source                                                                                                                                                            | Relevant finding                                                                                                                                                                                                                                                                                   | Limit for this discovery                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [Current sidebar](../../../apps/backoffice/src/layout/app-layout/sidebar/index.tsx) and [header](../../../apps/backoffice/src/layout/app-layout/header/index.tsx) | The retained shell has the wordmark, sidebar toggle and theme control; the business sidebar is empty.                                                                                                                                                                                              | Existing layout primitives do not select destinations, module ordering or shared areas.                                               |
| [Product thesis](../../../../the_unnamed_1/project_idea.md)                                                                                                       | Describes incremental adoption and examples of Inventory, Purchasing, POS and other possible modules.                                                                                                                                                                                              | This is product context and hypotheses, not an approved launch-module list, customer validation or implemented availability.          |
| [Published Inventory boundaries](../../../../the_unnamed_1/openspec/specs/inventory-module-boundaries/spec.md)                                                    | Inventory handles supplied stock effects and quantities; sales/weighing capture remains outside Inventory with POS. Physical-goods expiry is Inventory-owned but discovery-deferred; monetary valuation remains outside current Inventory, with future Pricing/Reports responsibilities undecided. | These functional boundaries do not select navigation labels or screens and do not establish current feature/API availability.         |
| [Inventory provenance](../../../../the_unnamed_1/openspec/provenance/inventory.md) and [open questions](../../../../the_unnamed_1/openspec/open-questions.md)     | Distinguish accepted scope from preserved unknowns, current implementation and proposed neighboring functions.                                                                                                                                                                                     | Unanswered questions remain unanswered. An example module or published full-product obligation is not a working frontend destination. |

No competitor or customer-usability claims are inferred from these sources.
They support keeping navigation proposals consistent with existing responsibilities
while leaving menu choices and module availability for the user.

## Proposed discussion order

1. Select the overall navigation model from the alternatives below.
2. Decide how enabled and unused modules appear in navigation, then map the
   initial merchant-facing modules and shared areas. Establish which are current,
   planned or outside the first UI scope before selecting destinations.
3. Define business/location context, module discovery, user-access visibility,
   shared settings/help and the relationship to explicitly requested complexity.
   These are open topics, not adopted controls or persistence policies.
4. Agree Spanish labels, grouping, depth and representative merchant journeys;
   carry their meanings consistently to the other four languages.
5. Record native requirements and a bounded TailAdmin prototype plan before UI
   edits. Use the existing responsive/theme/language review workflow, preserving
   current references until specific new image approval.

## First decision: overall navigation model — proposals

| Model                                                      | Merchant experience                                                                  | Trade-off                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| One business-wide sidebar, grouped by module — recommended | Module groups and their sections share one consistent business workspace.            | Keeps entry points together; the grouping and expansion rules must prevent a long menu as the business grows.                        |
| Module switcher with a module-specific sidebar             | The merchant chooses a module, then sees that module's sections.                     | Keeps each menu focused, with an additional switching concept and step between modules.                                              |
| Task-based sidebar across modules                          | Familiar business activities provide the main entry points across module boundaries. | Can keep everyday tasks direct; access, module ownership and discovery need careful explanation as modules differ between customers. |

Recommend exploring the first model for a familiar shared workspace while retaining
module boundaries. This is design judgment, not measured merchant usability or an
approved answer. The model choice alone will not settle actual modules, menu
names, unsubscribed-module visibility, routes or global simple/advanced modes.
Those choices follow in the discussion. No option is adopted by default.

## Verification for this initial record

Run native strict OpenSpec validation, formatting and local link checks. Confirm
only the permitted documentation changed and the actual app/approved visual build
remain intact. No application build or screenshot run is needed for this
documentation-only step. Leave changes unstaged and uncommitted.

Initial checks pass: all six changes validate under native strict OpenSpec;
the five affected Markdown documents have 31 valid local links/anchors, and
formatting passes. Exactly seven documentation files changed, with no staged
files and HEAD unchanged. The actual app and accepted visual source retain
`f3a81133d8061102614693778bc174e9e22b264a069b2a96a8a28e3cb729590e`.
At that initial record, the navigation-model answer was pending; the subsequent
selection is recorded below.

## Selected navigation model — 2026-11-12

The user answered **“One shared sidebar, grouped by module (Recommended)”**.
NAV-001 records one shared business-wide sidebar with module-grouped sections as
the primary model. This is explicit selection, not inference from a template or
the agent's recommendation. Actual modules, menu entries, labels, visibility,
expansion rules, routes and shared-area details remain open.

Record the choice and update the reading pointers; preserve the actual app and
approved references. This documentation-only decision requires native OpenSpec,
formatting and local-link checks, without new builds or image acceptance.

## Module visibility options — initial proposal

Recommend showing the modules enabled for the merchant's business in the main
sidebar, with other available modules discoverable in a separate area. This aims
to keep everyday navigation simple while making growth discoverable on request.
The alternative is to show enabled and unused modules together in the main
sidebar, making the broader offering more visible but increasing menu content.

The question presented these two approaches; the user's selection is recorded
below. This visibility discussion does not settle launch modules, exact discovery labels or
placement, activation/billing behavior, user-level permissions, or runtime
availability/error handling. Future possibilities remain clearly distinct from
currently available functionality. The actual module/shared-area map follows.

## Selected module visibility — 2026-11-12

The user answered **“Enabled modules + separate discovery (Recommended)”**.
NAV-002 records that the sidebar's module entries show modules enabled for the
business, with other available modules discoverable in a separate area. Shared
non-module areas remain to be defined; this choice does not remove room for them.

Enablement is a business/module concept, distinct from an individual user's
permissions or a temporary service condition. The selection does not define
those rules, activation or billing behavior, a catalogue of available modules,
discovery labels/placement or a launch plan. Proposed future modules remain
distinct from currently available functionality.

Record the decision in the spec and guidance; check native OpenSpec, formatting
and links while preserving app source and the accepted visual baseline.

## First module-map scope — proposal presented

Recommend detailing Inventory first, alongside the shared navigation areas, using
the module's concrete existing requirements as the basis for the first design
example. Other modules retain space in the conceptual structure and can be mapped
subsequently. The alternative is to outline the broader platform's module map
before detailing Inventory, keeping hypothetical/deferred modules explicit.

Ask which design scope the user prefers. This selects the next map's coverage
and discussion order, not a commercial launch-module list, implementation readiness
or feature availability. The actual Inventory sections and shared-area entries
would be proposed and agreed next; no menu labels, routes or product workflows
are selected by this recommendation.

## Selected first-map scope — 2026-11-12

The user answered **“Inventory + shared areas first (Recommended)”**. NAV-003
records this as design coverage and discussion order. It does not select a launch
module list, assert implementation readiness or approve concrete menu entries.
Other modules can be mapped later without changing the shared-sidebar model.

## First concrete menu — proposal presented

The following Spanish map was proposed; its subsequent selection is recorded
below. At presentation, these labels and destinations were unapproved and
described a proposed navigation structure, not working screens. Relative
placement, collapse behavior, permissions, routes and simple/advanced exposure
remain later decisions. Shared areas mean common entry points, not additional
paid business modules.

| Area       | Proposed entry               | Intended navigation responsibility                                                                                             |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Shared     | Inicio                       | Common starting point; its contents are still undefined.                                                                       |
| Inventario | Productos                    | Product identity, identifiers and lifecycle.                                                                                   |
| Inventario | Existencias                  | Recorded quantities by product and location, preserving exact meaning and honest absence/failure states.                       |
| Inventario | Movimientos                  | Stock entries/departures and their supported status/detail; proposed home for pending movement work and movement history.      |
| Inventario | Recuentos                    | Physical counts and reconciliation with recorded stock.                                                                        |
| Inventario | Configuración del inventario | Module-owned site, location and channel configuration.                                                                         |
| Shared     | Explorar módulos             | Entry to the separately selected discovery area for other available modules; catalogue and adoption behavior remain undefined. |
| Shared     | Configuración del negocio    | Proposed home for settings shared across modules; contents and access rules remain to be defined.                              |
| Shared     | Ayuda                        | Assistance entry point; channels and service commitments remain undefined.                                                     |

This recommendation keeps product identity, recorded stock, stock changes and
physical verification distinct. Putting pending movement work inside Movimientos
would avoid another permanent main entry; a dedicated Pendientes entry is a
reasonable alternative if the user wanted that work directly visible. At that
stage neither placement was selected. Configuración del inventario and
Configuración del negocio have different proposed ownership; their contents
need further definition.

### Supporting Inventory sources and limits

Consulted the purposes and requirement headings of these published owning specs
for the proposed groupings, rather than deriving menu labels from API names:

- [Product identity and lifecycle](../../../../the_unnamed_1/openspec/specs/inventory-product-identity-lifecycle/spec.md)
  supports the product grouping.
- [Recorded stock reads](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads/spec.md)
  supports a separate recorded-stock view.
- [Receipt/departure processing](../../../../the_unnamed_1/openspec/specs/inventory-receipt-departure-processing/spec.md),
  [operation lookup/history](../../../../the_unnamed_1/openspec/specs/inventory-operation-lookup-history/spec.md)
  and [Pending inspection/resolution](../../../../the_unnamed_1/openspec/specs/inventory-pending-inspection-resolution/spec.md)
  support stock-change, inspection and resolution responsibilities.
- [Stock counts/reconciliation](../../../../the_unnamed_1/openspec/specs/inventory-stock-count-reconciliation/spec.md)
  supports the count grouping.
- [Site/location/channel configuration](../../../../the_unnamed_1/openspec/specs/inventory-site-location-channel-configuration/spec.md)
  supports keeping module configuration discoverable.

These sources define business responsibilities with their own full-product,
contract and local applicability limits. Their publication does not establish
working frontend destinations, current integration or all listed functionality.
The shared entry points are design recommendations from the approved modularity,
simplicity and assistance principles, not features inferred from sibling IAM
or API implementation. No new sibling assignment or architecture work is needed.

The question covered only the map and labels. Screen contents,
team/account management, business/location selection, access handling, settings
depth and module activation remain undefined. Do not add invented KPIs, a sales
capture interface, monetary valuation, billing or an AI assistant to this map.
No production routes or fixtures are implemented in this documentation step.

### Verification after recording NAV-003

All six OpenSpec changes pass strict native validation. Formatting passes, all
38 local Markdown links/anchors in the affected documents resolve, and the eight
changed files are documentation only. The index is empty and HEAD remains
`07db0bb940164404408c1982dd62318ddb3d09ac`. The visual build's freshness check
confirms the actual rendering source still matches approved source fingerprint
`f3a81133d8061102614693778bc174e9e22b264a069b2a96a8a28e3cb729590e`.
No application builds or screenshots were needed for this documentation step.
At this check the concrete menu proposal awaited the user's decision, recorded
subsequently below.

## Selected initial map — 2026-11-12

The user answered **“Use this map as the starting point (Recommended)”** to:

> For the first navigation map, I recommend Inventory entries for Productos,
> Existencias, Movimientos, Recuentos and Configuración del inventario; shared
> entries for Inicio, Explorar módulos, Configuración del negocio and Ayuda.
> Pending movements would sit inside Movimientos. Does this grouping fit how you
> want merchants to work? This selects the navigation draft; screen contents and
> access rules would follow.

NAV-004 records these entries as the agreed design starting point, with pending
movement work within Movimientos. This resolves that placement for the starting
map; a separate Pendientes sidebar entry was not selected. The approval covers
the grouping and initial Spanish labels, not the full descriptions, screen
contents, access/availability rules, ordering, sidebar interaction, translations,
routes or production implementation. Inventory requirements retain their own
applicability limits. The other shared-area contents remain undefined.

Verification: all six changes pass strict OpenSpec validation after shortening
the new requirement's body and retaining the selected entries in its scenarios.
Formatting and all 38 local links/anchors pass. The same eight documentation files
are changed, the index is empty, HEAD is unchanged and the visual freshness check
retains the approved source fingerprint recorded above. No UI or reference edits
are included.

## Module-group expansion — proposal presented

Recommend collapsible module groups with **one group open at a time**. Entering a
module section would open its group; explicitly opening another group would
close the previous one. Shared entries would remain directly accessible outside
those groups. For example, while viewing Existencias the Inventario group would
be open, exposing its five selected entries. This aims to keep the menu readable
as more business-enabled modules are added.

The alternative is to allow multiple module groups open together, making their
destinations visible simultaneously at the cost of a potentially longer menu.
Both approaches retain the selected single shared sidebar and module grouping.
Neither is selected by the initial-map approval. This question concerns group
interaction, not a global simple/advanced mode; persistence, initial state on a
shared page, mobile drawer behavior and exact placement remain undefined.

## Selected module-group interaction — 2026-11-12

The user answered **“One module group open at a time (Recommended)”** to:

> For sidebar interaction, I recommend collapsible module groups with one open
> at a time: entering an Inventory page opens Inventario, and opening another
> module group closes the previous one. Shared entries stay directly accessible.
> Would you prefer this, or allow several module groups to stay open together?

NAV-005 records this interaction. Groups are collapsible, with at most one open;
entering a module page opens its group, and opening another closes the previous
one. Shared entries are reachable outside the groups, subject to access rules
still to be defined. This does not select group-state persistence, the initial
state on a shared page, mobile drawer details or a global simple/advanced control.
It also does not make other modules currently available.

Verification after NAV-005: all six changes pass strict OpenSpec validation;
formatting, 38 local links/anchors and the diff check pass. The same eight files
are documentation only, the index is empty, HEAD is unchanged and the current
visual source still matches the approved fingerprint recorded above.

## Navigation visibility for team permissions — proposal presented

Recommend showing only destinations a team member is known to have permission to
access. If none of a module's destinations are accessible, hide that module group
for that person. A direct link to a restricted destination would show a clear
access-denied message rather than imply an empty result or offer unavailable
actions. This aims to keep everyday navigation relevant to each team member.

The alternative is to retain restricted entries as disabled items with an
explanation, making those areas visible while adding unavailable choices to the
menu. Neither approach is selected. Business module enablement remains distinct
from the person's permissions and from transient technical availability.

This is a frontend navigation proposal, not a choice of roles, permission grants,
authorization contracts or identity integration. Sidebar visibility is not access
enforcement. Unknown/loading/failed permission information must not be equated
with known denial; its exact UI remains to be defined. No access-request workflow,
account/team-management feature or backend change is inferred from this question.

## Selected permission-based visibility — 2026-11-12

The user answered **“Hide sections the person cannot access (Recommended)”** to:

> For team permissions, I recommend showing only sections the person is allowed
> to access, hiding a module group if none of its sections are accessible. A
> direct link to a restricted section would show a clear access-denied message.
> Would you prefer this, or keep restricted entries visible but disabled with an
> explanation? This defines navigation behavior; roles and permission
> assignments remain separate.

NAV-006 records the selected behavior for known permissions: permitted sections
are shown, restricted ones hidden, and a group with no accessible sections hidden
for that person. Restricted direct links show clear access denial. This does not
disable the module for the business or substitute sidebar visibility for access
enforcement. Roles, grants, permission acquisition and integration stay outside
this choice. Unknown/loading/error states are not known denial and need their
own UI definition next.

Verification after NAV-006: all six changes pass strict OpenSpec validation;
formatting, 38 local links/anchors and the diff check pass. The same eight files
remain documentation only, the index is empty, HEAD is unchanged and the current
visual source retains the approved fingerprint recorded above.

## Unknown/loading/failed permission information — proposal presented

Recommend a neutral loading state in permission-dependent navigation until access
is known. If permissions cannot be checked, replace that state with an explicit
error and a retry action. Do not present an empty menu as “no access”, claim a
known denial, or show guessed permitted sections. Apply the same distinction on
a directly requested restricted-capable page; an unverified check is not a
confirmed denial. This follows the approved honest-status principle, while the
specific UI remains a proposal.

The alternative is a full-workspace loading/error state until permissions can be
checked, rather than limiting that state to permission-dependent navigation and
content. It offers a simpler all-or-nothing transition but blocks unrelated
controls too. Neither approach is adopted here. This question does not select a
permission-fetch contract, cache, retry timing, identity flow or network library;
those are not needed to agree the visual state model.

## Selected permission-state scope — 2026-11-12

The user answered **“Loading/error only where access must be checked
(Recommended)”** to:

> While permissions are being checked, I recommend a neutral loading state only
> for navigation and content that depend on them. If the check fails, show a
> clear error with Retry; keep unrelated controls usable. Would you prefer this,
> or block the entire workspace with a loading/error screen until access can be
> checked? Neither state would be presented as confirmed lack of access.

NAV-007 records neutral loading and explicit error/Retry in the affected areas,
keeping unrelated controls usable. Unknown/loading/error remains distinct from
confirmed access denial. This also applies to the affected content of a directly
requested section. Permission acquisition, cache/invalidation, automatic retries
and integration remain outside this decision.

Verification after NAV-007: all six changes pass strict OpenSpec validation;
formatting, 40 local links/anchors and the diff check pass. The same eight files
remain documentation only, with an empty index, unchanged HEAD and the approved
visual source fingerprint recorded above.

## Inventory location scope — proposal presented

Recommend choosing location scope within each relevant Inventory page, with that
scope clearly visible near the page heading. For example, the merchant would see
which stock location their Existencias view covers. The alternative is one shared
location selector whose selection applies across the relevant Inventory views.
The former makes each view's scope explicit and independent; the latter can
reduce repeated selection but requires clear rules for which views it affects.
Neither approach is selected.

The existing sources support keeping place and stock meaning precise:
[recorded stock](../../../../the_unnamed_1/openspec/specs/inventory-recorded-stock-reads/spec.md)
requires the product and stock location for each balance;
[configuration](../../../../the_unnamed_1/openspec/specs/inventory-site-location-channel-configuration/spec.md)
keeps sites and stock locations distinct, allowing a shop's sales floor and
stockroom to be separate locations. The existing source links and their
applicability limits above continue to apply. A location is not automatically
the whole shop, and a recorded balance does not certify physical stock.

This question selects where scope is controlled, not single/multiple selection,
an all-locations total, defaults, persistence, business switching, exact control
wording or mutation targets. Product identity and its merchant-wide code rules
are not redefined by a location filter. No cross-module location contract or
backend change is proposed.

## Selected location-scope ownership — 2026-11-12

The user answered **“Independent location selection per page (Recommended)”** to:

> For Inventory location scope, I recommend a location selector on each relevant
> page, with its current scope clearly visible near the heading. A location can
> be a sales floor or stockroom, not necessarily the whole shop. Would you prefer
> independent selection per page, or one shared selector that changes the
> location across relevant Inventory views? Defaults and remembering selections
> would be defined separately.

NAV-008 records independent page-owned selection and scope visible near the
heading. A user's scope change on one page does not implicitly switch another
page's selection. The decision preserves the distinction between a site and its
stock locations. It does not choose defaults, persistence, single/multiple
selection, aggregate stock, business switching or the target of a stock-changing
action. Existing stock and configuration requirements retain their scopes.

Verification after NAV-008: all six changes pass strict OpenSpec validation;
formatting, 40 local links/anchors and the diff check pass. The same eight files
remain documentation only, with an empty index, unchanged HEAD and the approved
visual source fingerprint recorded above.

## Initial location and remembering choices — proposal presented

Recommend the following behavior for page viewing scope within the same user and
business context:

- If there is exactly one known accessible location, select it and show its name.
- If there are several and the page has no explicit choice, ask the merchant to
  choose before showing location-dependent results; do not guess a location.
- Remember each page's explicit choice within the current tab session, keeping
  the visible scope when returning to that page. Closing the tab ends this
  retention; cross-tab, long-term and cross-device preferences are not proposed.

The alternative is to require an explicit location choice each time a page is
opened, including when only one location is accessible. That makes every choice
deliberate but adds repeated steps. Neither approach is selected. The proposal
does not settle multi-location selection, totals, unavailable/retired-location
recovery or mutation targets. Reusing a choice cannot grant access or imply that
access or location validity is unchanged; any implementation must preserve the
selected honest permission-state behavior. No storage mechanism is selected.

## Selected location defaults and retention — 2026-11-12

The user answered **“Sole location automatic; otherwise ask and remember per tab
(Recommended)”** to:

> For each page’s initial location, I recommend selecting the sole accessible
> location automatically; if several are available and none is selected, ask the
> merchant to choose before showing results. Remember each page’s explicit choice
> while that tab stays open, always showing its scope. Closing the tab ends that
> retention. Would you prefer this, or require an explicit location choice every
> time the page opens? This concerns viewing scope, not targets for stock-changing
> actions.

NAV-009 records the selected initial choice and per-tab remembering policy for
page viewing scope. One known accessible location is selected automatically;
several with no current choice require a choice before location-dependent
results. Explicit selections are remembered per page while the tab stays open,
with scope visible, and closing the tab ends that retention. This does not
establish cross-tab, long-term or cross-device preferences or automatically
select mutation targets. Reusing a choice cannot grant access or establish
continued location validity. No particular storage mechanism is selected.

Verification after NAV-009: all six changes pass strict OpenSpec validation;
formatting, 41 local links/anchors and the diff check pass. The same eight files
remain documentation only, with an empty index, unchanged HEAD and the approved
visual source fingerprint recorded above.

## First prototype layout and responsive behavior — proposal presented

Recommend this placement for the agreed starting map:

- **Top:** Irin wordmark followed by Inicio.
- **Middle:** the enabled module groups, with Inventario's selected entries and
  the agreed one-open-group interaction.
- **Bottom:** Explorar módulos, Configuración del negocio and Ayuda, outside the
  module groups and subject to the selected access rules.

Retain the existing TailAdmin desktop sidebar and tablet/mobile drawer. The
current [responsive hook](../../../apps/backoffice/src/hooks/use-mobile.ts) uses
the existing 1280px sidebar breakpoint. In the proposed prototype, choosing a
destination on tablet/mobile would close the drawer. Keyboard dismissal and
focus handling would be checked using the retained sidebar/Sheet primitives.
These are proposed UI behaviors, not decisions inferred from the template.

For the first review, recommend a development-only Storybook navigation
prototype with simulated permitted/restricted/loading/error states and
page-owned location choices. Destination content would remain neutral,
clearly identified preview content: no product-creation flow, stock-changing
actions, invented metrics, actual module activation or backend integration.
Use the existing responsive/dark/five-language review workflow. New captures
remain candidates until specifically approved; existing references stay intact.

The alternative is to refine placement and responsive behavior before preparing
that prototype. The user's answer is needed before adopting this layout and
preparing the exact bounded implementation/verification plan. Business switching,
discovery/settings/help contents, multi-location selection, detailed stock flows,
and a global simple/advanced mechanism do not need invented answers merely to
review the navigation structure.

## Selected first prototype — 2026-11-12

The user answered **“Use this layout for the prototype (Recommended)”** to:

> For the first Storybook navigation prototype, I recommend Inicio at the top,
> Inventario in the middle, and Explorar módulos, Configuración del negocio and
> Ayuda at the bottom. Retain TailAdmin’s desktop sidebar and tablet/mobile
> drawer, closing the drawer after choosing a destination. The preview would use
> simulated access/location states and neutral destination content. Would you use
> this layout for the prototype, or refine placement/mobile behavior first?

NAV-010 records the layout and responsive choice. Proceed with that development-only
prototype and its simulated states under the [implementation plan](implementation-plan.md).
This is authority for the selected Storybook preview, not production destinations,
business switching, module activation, new roles, product flows or image acceptance.
Existing approved references remain intact. Other undefined product details can
stay outside the prototype rather than gating a concrete navigation review.

## Prototype implementation and review

The preview code lives under `.storybook/stories/`, with copy in the five
catalogue-only dictionaries. Real TailAdmin sidebar/header/accordion/select/
button/card primitives provide the UI; no production routes, messages, API or
stock-changing actions are introduced. Named examples cover the workspace,
known restricted access, no accessible module sections, permission loading,
permission error with a simulated Retry, and a sole location. Controls change
fixtures; they are not real roles or permission assignments.

The eight model tests were observed failing before the corresponding behavior,
then passing. Browser tests cover live navigation in each language, independent
choices, access-state distinctions, drawer closing and keyboard focus. New
scenarios are registered in the existing visual inventory; capture and comparison
settings and image approval rules are retained.

Independent read-only review found two material issues before final capture:
an opener-created tab could inherit copied session storage, and the stories
omitted the existing full-viewport decorator flag. The popup case was reproduced
with pinned Chromium: the new tab selected stockroom instead of starting without
a selection. A fresh-entry restoration guard and popup regression address it.
The stories now explicitly enable the existing full-viewport decorator, with
browser assertions. Re-review found no further material static defects.

Subsequent compact-state inspection reproduced sidebar error-copy overflow
(content width 113px within a 55px container). The compact state now exposes an
accessible icon Retry control and announced error, while the full error remains
visible in the affected content. A browser overflow assertion and registered
compact-error capture cover that correction. Compact loading also has an
explicit accessible status label. Comparison thresholds and references are
unchanged.

### Preview retention boundary

Page choices persist during in-preview navigation and supported reloads. A fresh
preview entry/re-entry or fixture-control reset can clear the simulation.
Restoration uses the parent document's navigation type, retaining direct-preview
and Storybook-manager reloads while discarding copied session storage on fresh
entry. Reloading only an embedded iframe under a freshly entered manager counts
as fresh entry. Browser-chrome reopening/session restoration is not verified.
These are development-preview boundaries; NAV-009 remains the selected product
policy for a future real implementation, not a claim of complete production
persistence coverage from this prototype.

## Final prototype verification — 2026-11-12

- `pnpm check` passes formatting, lint, all type checks and **54 code tests**:
  34 backoffice tests including the eight preview-model tests, and 20 visual-tool
  tests. Tests were rerun after the compact-state correction.
- `node visual/prepare.mjs` passes the original full build pipeline: static
  backoffice, static landing, font preparation, Storybook and native Astro gallery.
  Coverage has no missing/unknown source, story or duplicate identities: **216
  retained source modules, 58 stories, 21 view entries and 115 scenarios**.
- `node visual/cli.mjs languages` passes **37 browser checks**, including all ten
  new navigation checks. They cover the five locales, independent page choices,
  direct-preview/manager reloads, opener/new-tab isolation, access states, compact
  error fit, tablet/mobile drawer selection and Escape/focus restoration.
- Strict native OpenSpec validation passes all six changes; local-link checking
  resolves 45 links/anchors in affected Markdown documents. Formatting and
  `git diff --check` pass.
- Candidate run **`2026-11-12T20-09-57.538Z`** passes **72/72** navigation cases,
  with zero failed, skipped or flaky cases. All 72 unique image identities and
  PNG hashes were verified. Representative desktop, mobile drawer, dark and
  compact-error candidates were visually inspected.
- Existing-reference comparison **`2026-11-12T20-10-48.210Z`** passes **388/388**,
  with zero failed, skipped or flaky cases. The negative navigation filter
  excludes the 72 unapproved cases; full comparison including them requires
  their specific approval. The comparison viewer's generic zero-candidate text
  does not replace the successful comparison results or approve new images.

Both runs use source
`d16a691967ef7b0d420ef0769f67b45f81c227a02629f6a2a7ef6597087d584b`,
pinned Chromium `158.0.8127.18`, Playwright `1.65.0`, Mac arm64 CPU rendering and
the unchanged font identity
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.
The selected screenshot profiles, threshold `0.01` and `maxDiffPixels: 0` remain
unchanged. Existing vendor build warnings do not prevent successful builds.

The index is empty and HEAD remains
`07db0bb940164404408c1982dd62318ddb3d09ac`. Production sources/routes, production
dictionaries, landing, dependencies and the 388 approved PNGs/registry remain
unchanged. Normal static outputs contain no navigation fixture content. There
are no commits, promotions, deployment or sibling writes.

Review the [live prototype](http://localhost:6006/?path=/story/navigation-merchant-workspace--workspace)
and the [exact 72-candidate run](http://localhost:9324/runs/2026-11-12T20-09-57.538Z/review.html).
The latter is separate from the comparison report and remains available if a
later run changes the latest viewer. All 72 navigation images remain unapproved.
The next step is user review, not automatic continuation into production flows.

## User review and revision direction — 2026-11-12

The user liked the prototype and reported three issues: the Inventory caret
widens/looks wrong in the collapsed sidebar, the access-check error is also
displayed in the sidebar, and the page frame consumes space needed for tables
with substantial information. The user cited Excel's simplicity and use of space
as their reference. This is a direct workspace-design priority, not a claim about
measured customer preference or a decision to build a spreadsheet interface.
“I like it” together with requested corrections is not approval of the previous
72 image candidates; none are promoted.

Current-browser inspection confirms the collapsed trigger is 72px wide inside
its 57px parent, retaining the right caret. On the Products preview at 1440×900,
the neutral content begins at y=337px while the global header ends at y=77px.
The banner, separate title row and empty card contribute to that overhead.

The user selected **“Single content error + compact page frame (Recommended)”**
to the proposed revision: show the error once in content with Retry, move preview
notices into Storybook documentation, use a slim title/location toolbar, remove
the large empty card, and preserve readable text and existing control sizes.
This authorizes the bounded revision below, not table columns, row density,
spreadsheet editing, production routes or a global density mode.

### Revision plan

1. In `.storybook/stories/navigation-prototype.tsx`, hide the module trigger's
   caret when the sidebar is compact and keep the trigger within its rail.
   Retain normal expanded/hover behavior and the existing control semantics.
2. Show permission-check failure once in the affected content with Retry. The
   sidebar does not duplicate the message or an additional error control.
   Known denial and neutral loading retain their distinct meanings.
3. Remove the always-visible preview banner and large empty content card. Retain
   the existing global header and form/control metrics; use a compact, full-width
   page toolbar for title and location, inline where space permits. Keep neutral
   destination copy brief. Document fixture status in Storybook metadata/review
   limitations. Forms, tables and data are not designed by this change.
4. Add a named Products story and registered captures. Extend browser regression
   coverage for rail geometry, single error placement, reclaimed page space and
   responsive overflow. Use a failing reproduction before the fix, then the
   existing quality/build/browser/capture/comparison workflow.
5. Modify only the existing prototype/stories, navigation browser tests,
   `visual/inventory.json`, visual guide and this change's specs/plan/tasks and
   reading pointers. No dependencies, reusable production primitives, app routes,
   approved references or sibling files change. Capture revised candidates for
   review; never promote them without specific user image approval.

## First revision verification — 2026-11-12

The selected revision is implemented under NAV-011–013. Three browser regressions
were observed failing against the previous implementation: the compact caret was
still present, the access error appeared twice, and the Products content started
at y=337px instead of within the compact-frame bound. All now pass. The existing
global header, readable text and control metrics remain in use; no table contents,
row density, spreadsheet editing or global density mode were invented.

At **1440×900**, Products' content now starts at **149px instead of 337px**, reclaiming
**188px vertically**. Location controls remain **44px** high. The preview uses the
available page width, including at the tested 1920px width, with responsive
wrapping and no large empty card. The [before/after frame comparison](http://localhost:9324/navigation-space-comparison.html)
shows the two measured frames; these diagnostic images are not approved references.

Verification results:

- `pnpm check` passes formatting, lint, types and **54 code tests**. Strict native
  OpenSpec validation passes all six changes.
- The original full `visual/prepare.mjs` pipeline passes. Coverage remains complete:
  **216 retained source modules, 59 stories, 21 view entries and 116 scenarios**.
  Stale ComponentCard associations were removed from the navigation entries;
  its real composition coverage remains intact.
- The full language/navigation suite passes **39 browser checks**, including the
  new rail-geometry and reclaimed-space cases. Error placement is checked in both
  expanded and compact states; existing page-choice, permission, language,
  drawer and focus behaviors still pass.
- Revised candidate run **`2026-11-12T20-36-54.230Z`** passes **76/76** cases with
  zero failed, skipped or flaky cases. All 76 unique candidate identities and PNG
  hashes are verified. Products, compact navigation, single-error content and
  mobile layout were visually inspected.
- Existing-reference comparison **`2026-11-12T20-37-36.382Z`** passes **388/388**
  cases, with zero failed, skipped or flaky cases. No accepted reference changed.
- Independent read-only review found no material accessibility, responsive,
  permission/state or scope regression in the selected corrections.

Both current runs use source
`70b9e49cf4d012df5ce1c6bc98883d1d64a81eb8afec31f143700b72a1297d27`,
with the same pinned Chromium/Playwright, Mac renderer, font environment and
comparison settings recorded above. Production source/routes, dictionaries,
landing, dependencies and approved references remain unchanged. The index is
empty and HEAD is unchanged; nothing was staged, committed or deployed.

Review the [revised Products preview](http://localhost:6006/?path=/story/navigation-merchant-workspace--products)
and [exact 76-candidate revision](http://localhost:9324/runs/2026-11-12T20-36-54.230Z/review.html).
This run supersedes the previous 72 candidates for the current revision review.
All new images remain unapproved; positive review wording did not promote them.

## Second user review and selected toolbar revision — 2026-11-12

The user reported that hiding the caret did not remove its space and that the
Inventory icon remained larger than the neighboring icons. The previous fix
addressed glyph overflow but left the accordion trigger's wider layout and
20px icon, while collapsed menu controls use a 32px footprint and 16px icons.
This is an incomplete correction to be fixed, not a new preference question.

The user also found the two-button header too tall and suggested possible hover
growth. Presented with one compact combined toolbar, a slim separate header, or
hover/focus expansion with a touch alternative, the user selected **“One compact
toolbar with page controls (Recommended)”**. The selected preview combines the
menu button, page title, location selector where applicable and theme button in
one compact toolbar. Controls remain visible and retain their existing sizes.
Hover activation is not required. Small viewports can wrap the location controls.

### Bounded second-revision plan

1. Extend the compact-trigger browser regression to compare its width, height,
   icon dimensions and icon alignment against the adjacent Home control, and
   check expanded icon consistency. Add a combined-toolbar regression covering
   title/location containment, visible controls, height and reclaimed content
   space. Observe these fail before the fixes.
2. In the development-only `navigation-prototype.tsx`, match the compact module
   trigger to the existing menu-control footprint, including padding and the
   16px icon. Keep the expanded caret and accessible group semantics.
3. Replace the prototype's separate AppHeader and page toolbar with one compact
   header composed from the retained Button, icons and ThemeToggleButton. Keep
   the same menu/drawer and theme behavior, localized accessible labels and
   location-control metrics. Do not change the reusable production AppHeader.
4. Update navigation source associations in `visual/inventory.json` to reflect
   actual primitives used. No story, renderer, dependency or reference additions
   are needed; regenerate the existing 76 candidates across the same profiles.
5. Run quality checks, builds, full browser checks, candidate capture, protected
   388-case comparison and read-only review. Record fresh run identities and
   leave all revised images unapproved. Production sources and sibling repos
   remain untouched; no staging, commits or deployment.

Read-only review of the second revision found a related pre-existing compact
control issue: it announced expansion while the panel was absent, and Enter
opened the rail while toggling the group closed. Pinned-browser reproduction
confirmed `aria-expanded=true` in the compact rail and `false` after activation.
The preview now derives effective expansion from visible content and opens the
rail plus group together on compact activation. The geometry regression also
checks this keyboard path; no new module capability or production primitive is
introduced by making the control's announced state match its visible action.

## Second revision verification — 2026-11-12

The compact Inventory trigger now matches Home exactly after transitions settle:
**32×44px** button, **16×16px** icon and matching icon centre at x=32px in the
1440×900 test viewport. Expanded icons also match. The icon-only control announces
closed when its panel is absent; keyboard activation opens the rail and group
together. The corresponding regressions were observed failing before the fixes
and now pass. Independent re-review found no further material static issues.

At the tested desktop size, one **53px** toolbar replaces the separate two-button
header and page-title/location row. Products content starts at **69px instead of
149px** in the preceding revision, reclaiming another **80px vertically**.
The menu, theme and 44px location controls retain their previous sizes and stay
visible. On small screens the location/theme group wraps in normal DOM order.
The reusable production AppHeader and sidebar primitives were not modified.

Current-source verification:

- `pnpm check`: formatting, lint, types and **54 code tests** pass.
- Original full build/coverage pipeline passes: **216 retained source modules,
  59 stories, 21 view entries and 116 scenarios**. Navigation source associations
  now refer to the actual theme control rather than the unused AppHeader.
- Full language/navigation suite: **40 browser checks** pass, including exact
  compact geometry, expanded icon consistency, keyboard semantics, combined
  toolbar containment/height and existing access/location/drawer behavior.
- Capture **`2026-11-12T20-55-33.329Z`**: **76/76** candidates pass, with zero
  failed, skipped or flaky cases. Image identities and hashes were verified;
  compact desktop, Products and mobile wrapping were visually inspected.
- Comparison **`2026-11-12T20-56-52.375Z`**: **388/388** accepted cases pass,
  with zero failed, skipped or flaky cases. Existing reference files are intact.
- Native strict OpenSpec validation passes all six changes. Production sources,
  landing, dependencies, accepted PNGs/registry, Git HEAD and empty index are
  preserved. There is no staging, commit, promotion or deployment.

Both current runs use source
`f0fe63b5ac4154e859a14defc8e9282bff64ec92b9d6b6c281de33136295fb06`
and the unchanged renderer/font/profile/comparison settings recorded above.

Review the [current prototype](http://localhost:6006/?path=/story/navigation-merchant-workspace--products),
[toolbar before/after](http://localhost:9324/navigation-toolbar-comparison.html)
and [current 76-candidate run](http://localhost:9324/runs/2026-11-12T20-55-33.329Z/review.html).
This run supersedes earlier unapproved navigation candidates for this revision.
All new images still await specific user approval.

## Third user review: rail width, header format and folding footer — 2026-11-12

The user's annotated screenshot identifies unused space beside the compact
buttons. Prior fixes matched button/icon dimensions but retained the template's
90px rail. The user also asked about lighter/smaller header buttons and suggested
making the shared footer collapsible. These are distinct from the earlier caret
overflow; correcting only the glyph or button did not reclaim the rail width.

The user selected **“Use this compact direction and folding footer
(Recommended)”** for the concrete proposal: a **64px** collapsed rail with centred
**44px** buttons and **16px** icons; borderless header actions with **16px** icons,
**36px** buttons on desktop and **44px** on tablet/mobile; and a footer folding
under **“Más opciones”**, initially open. Existing hover/focus backgrounds remain
subtle and controls stay visible. This supersedes retaining the earlier desktop
action sizes, not the selected combined-toolbar layout.

### Bounded third-revision plan

1. Extend the real browser regressions to require the whole rail/gap to be 64px,
   44px centred compact controls with balanced gutters, matching module icons,
   and main content beginning at the rail's edge. Check desktop ghost action
   dimensions and tablet/mobile targets. Add keyboard footer folding checks at
   desktop/tablet/mobile. Observe failures before implementing these changes.
2. Set the existing SidebarProvider's supported compact-width CSS variable only
   for this preview. In `navigation-prototype.tsx`, adjust compact header/content/
   footer gutters and centre every compact action. Add scoped
   `navigation-prototype.css` under the same stories directory where needed to
   override the vendor menu's forced 32px compact size, without editing shared
   production primitives. Keep expanded sidebar and drawer widths unchanged.
3. Compose both header actions from retained Button, theme context and existing
   icons: ghost appearance, 16px glyphs, 36px desktop or 44px tablet/mobile targets.
   Preserve labels, focus visibility, menu/drawer and theme behavior. Do not
   change the production ThemeToggleButton or header.
4. Add one initially open footer toggle, with local preview state independent
   of module expansion. It retains the three selected shared links when open.
   Add its label to all five catalogue dictionaries. Do not add account/session
   persistence, new routes or new permission grants.
5. Add expanded/compact folded-footer capture actions in the existing visual
   runner and inventory. Re-run quality/build/browser checks, read-only review,
   current candidate captures and the 388 protected comparisons. No renderer,
   dependency, production-source, reference, staging or commit changes.

The first rendered check caught the vendor's 32px utility-layer `!important`
rule winning over the matched but unlayered preview override. CSSOM inspection
confirmed both rules and their layers. The scoped override is now in the
components layer so its important declaration precedes the vendor utility layer
in the important cascade. This remains confined to the preview's root attribute.

### Additional steering: thinner Ubicación

While the combined revision was being checked, the user said **“The Ubicación is
too high, it shuld be thiner”**. Reduce the desktop selector using the retained
small SelectTrigger variant, matching the already selected 36px desktop action
height and preserving its text. Keep the existing 44px tablet/mobile target and
all selection behavior. NAV-018 records this refinement; no production form
primitive or new sizing mode is introduced. The browser check reproduces the
previous 44px desktop height before the prop change. Refresh the same 84 current
cases after this steering; the earlier 84-case run is not final or approved.

### Final combined-revision verification

The final preview implements NAV-015–018. Rendered Ubicación measures **36px on
desktop**, retaining **14px text**, and **44px on tablet/mobile**. The desktop
toolbar is now **45px** high. Browser assertions also confirm the full **64px**
collapsed rail, centred **44px** compact targets with **16px** icons, main content
at the rail edge, responsive ghost header actions and keyboard footer folding.

- `pnpm check` passes formatting, lint, types and **54 code tests** (34 backoffice,
  20 visual tooling). Static app/catalogue builds pass.
- All **43 browser checks** pass, including footer keyboard interaction at
  1440px, 768px and 390px and responsive location dimensions.
- Final capture **`2026-11-12T21-36-33.733Z`** passes **84/84** cases with zero
  unexpected, skipped or flaky cases. All 84 unique candidate PNG hashes match
  their run manifest.
- Protected comparison **`2026-11-12T21-37-38.826Z`** passes **388/388** cases,
  also with zero unexpected, skipped or flaky cases. Existing references and
  their registry remain unchanged.
- Coverage records **216 source modules, 59 stories, 21 actual view entries,
  118 scenarios and 472 profile cases** (388 accepted plus 84 new navigation).
- Independent read-only review found no material regressions, including the
  scoped CSS layer and existing responsive SelectTrigger variants. Production
  sources, dependencies and landing remain unchanged; the index remains empty
  and no commit was made.

Both final runs use source hash
`9661e641d4cd83010f26d4aaff364800f242ee3733d5e7e8a8aaa51091b027f2`.
The renderer remains macOS arm64, Node 26.13.1, pnpm 12.18.0, Playwright 1.65.0,
Chromium 158.0.8127.18 with `--disable-gpu`, DPR 1, colour threshold 0.01 and
`maxDiffPixels: 0`. Font hash remains
`1f28fef132882a1d566ec83299979551a289c24dd430029f260520d8a8ce81d3`.
Logs and dimension evidence are under `.cache/visual/navigation-rail-*` and
`.cache/visual/navigation-location-thin-metrics.json`.

Review the [live workspace](http://localhost:6006/?path=/story/navigation-merchant-workspace--workspace),
[exact final 84-candidate run](http://localhost:9324/runs/2026-11-12T21-36-33.733Z/review.html)
and [rail before/after](http://localhost:9324/navigation-rail-comparison.html).
All navigation runs, including earlier 72-, 76- and 84-case versions, remain
unapproved. This final run supersedes earlier captures for review; it does not
promote references or authorize production flows.

## Final image approval and commit preparation

The user asked **“That looks very good. Is it a good moment to stage changes and
commit? Or do you have any missing adjustment before it?”**. The response
recommended navigation code/specifications and approved visual references as two
separate commit batches, and explicitly asked whether all 84 images from
`2026-11-12T21-36-33.733Z` were approved. The user answered **“I approve all
revisions.”**. This is the specific approval for that exact final run; earlier
superseded candidate runs are not promoted.

The standard promotion command validated current source, renderer, profile and
PNG identities, recording the verbatim approval **“I approve all revisions.”**
in `visual/references.json`. Exactly **84 navigation cases** were added, producing
**472 accepted references**. All 388 previous registry entries and PNGs are
preserved. Approval does not select product table contents or turn the preview
into production functionality.

Commit preparation follows the user's standing request: stage the navigation
code/specifications first, provide the commit command, then wait for the user's
commit before staging the 84 approved PNGs and registry. Agents never execute
commits. No archive, infrastructure, production integration or deployment is
authorized by this preparation.

### Post-approval verification and first batch

Full comparison **`2026-11-12T21-47-49.746Z`** passes **472/472** accepted cases,
with zero failed, skipped or flaky cases, against source
`9661e641d4cd83010f26d4aaff364800f242ee3733d5e7e8a8aaa51091b027f2` and the
unchanged pinned renderer. Final `pnpm check` passes formatting, lint, type checks
and all 54 code tests; strict OpenSpec validation passes all six changes. All 45
local Markdown links resolve. Logs are `.cache/visual/navigation-approved-check.log`
and `.cache/visual/navigation-approved-full-compare.log`.

The first staging batch contains **26 files**: navigation OpenSpec/agent context,
five catalogue dictionaries, the development-only preview/model/styles/stories,
and meaningful code/browser/capture coverage. The second batch contains **85
files**: 84 approved navigation PNGs plus `visual/references.json`. The original
388 registry entries and reference PNGs remain unchanged, as do production app
sources, dependencies and the landing. No commit is executed by the agent.
