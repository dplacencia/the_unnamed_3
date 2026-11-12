# Backoffice navigation

## ADDED Requirements

### Requirement: NAV-001 — One shared sidebar grouped by module

The merchant backoffice SHALL use one shared business-wide sidebar with sections
grouped by module. This SHALL be the primary navigation model. Actual modules,
menu entries, labels, visibility rules, expansion behavior and routes SHALL
follow separate user decisions; this selection alone MUST NOT authorize their
implementation or introduce new product capabilities.

#### Scenario: A merchant navigates between module areas

- **WHEN** navigation for different module areas is designed
- **THEN** their sections are organized within the same shared sidebar model
- **AND** a separate workspace/sidebar for each selected module is not substituted as the primary model.

#### Scenario: The concrete menu is defined

- **WHEN** module entries, shared areas or visibility rules are proposed
- **THEN** those choices are presented separately for the user's decision
- **AND** the shared-sidebar choice does not select a launch-module list or promise currently available functionality.

### Requirement: NAV-002 — Enabled modules with separate discovery

Module entries in the main sidebar SHALL cover only modules enabled for the
merchant's business. Other available modules SHALL be discoverable in a separate
area. This selection SHALL keep business enablement distinct from user access
and runtime availability; the actual catalogue, discovery labels/placement and
activation/billing behavior SHALL follow separate decisions.

#### Scenario: An enabled module is represented in navigation

- **WHEN** navigation for a business-enabled module is designed
- **THEN** it belongs within the shared sidebar's module grouping
- **AND** user-level access rules remain a separate definition.

#### Scenario: An available module has not been enabled

- **WHEN** a module is available but not enabled for the business
- **THEN** it is discoverable through the separate area rather than an active module entry in the main sidebar
- **AND** this does not present merely proposed future functionality as available.

### Requirement: NAV-003 — Inventory and shared areas as the first design map

The first concrete navigation map SHALL cover Inventory alongside shared areas,
using existing Inventory business requirements as supporting context. This
selection SHALL define design coverage and discussion order only. It MUST NOT
establish a commercial launch-module list, current feature/API availability,
menu entries or implementation authority.

#### Scenario: The first concrete menu is proposed

- **WHEN** the first navigation map is prepared for user review
- **THEN** it details Inventory and proposes the shared navigation areas
- **AND** concrete entries and labels remain proposals until separately selected.

#### Scenario: A broader module has not been mapped

- **WHEN** another platform module falls outside this first design pass
- **THEN** its menu is left for subsequent definition
- **AND** its absence from the first map is not treated as a permanent product exclusion.

### Requirement: NAV-004 — Agreed initial Inventory and shared-area map

The navigation design SHALL use the Spanish groupings and pending-work placement
in the scenarios below as its agreed starting map. Screen contents, access and
availability rules, ordering/placement, expansion, routes, translations and
implementation SHALL require separate decisions. This map MUST NOT imply
currently available functionality.

#### Scenario: The first Inventory navigation is detailed

- **WHEN** the agreed map is developed into a concrete navigation design
- **THEN** Inventario contains Productos, Existencias, Movimientos, Recuentos and Configuración del inventario
- **AND** pending movement work belongs within Movimientos rather than a separate Inventory sidebar entry.

#### Scenario: Shared destinations are detailed

- **WHEN** shared navigation areas are designed alongside Inventory
- **THEN** Inicio, Explorar módulos, Configuración del negocio and Ayuda form the agreed starting map
- **AND** their screen contents and access rules follow separate definitions.

### Requirement: NAV-005 — One module group open at a time

Module groups SHALL be collapsible, with at most one group open at a time.
Entering a module page SHALL open its group; opening another group SHALL close
the previous one. Shared entries SHALL remain directly accessible outside these
groups, subject to separately defined access visibility. Persistence, initial
state on shared pages, mobile drawer behavior and global interface-depth controls
remain separate decisions.

#### Scenario: A merchant enters an Inventory page

- **WHEN** the merchant navigates to Existencias
- **THEN** Inventario opens to expose its selected entries
- **AND** no other module group remains open.

#### Scenario: A merchant opens another module group

- **WHEN** the merchant opens a different module group represented in the sidebar
- **THEN** the previously open group closes
- **AND** both groups remain within the same shared sidebar.

#### Scenario: A merchant uses a shared entry

- **WHEN** the merchant accesses a shared navigation entry available to them
- **THEN** that entry is directly accessible outside the module groups
- **AND** opening a module group is not required to reach it.

### Requirement: NAV-006 — Hide sections without user access

When a team member's permissions are known, the sidebar SHALL show only sections
they may access and SHALL hide a module group if none of its sections are
accessible. Restricted direct links SHALL show a clear access-denied message.
This defines navigation behavior, not access enforcement. Roles, grants and
unknown/loading/error states remain separate definitions.

#### Scenario: A section is known to be restricted

- **WHEN** the member's known permissions deny access to a sidebar section
- **THEN** that section is hidden from their navigation
- **AND** other permitted sections remain available.

#### Scenario: No section in a module is accessible

- **WHEN** known permissions allow none of a module's sections for the member
- **THEN** its module group is hidden for that member
- **AND** this does not imply the module is disabled for the business.

#### Scenario: A member follows a restricted direct link

- **WHEN** the member follows a direct link to a section they are known not to be allowed to access
- **THEN** the interface shows a clear access-denied message
- **AND** it does not represent the denial as an empty business result.

### Requirement: NAV-007 — Permission loading and errors stay scoped

Navigation and content dependent on a permission check SHALL show neutral loading
while it is pending. A failed check SHALL be explained once in the affected
content with Retry under NAV-012. Unrelated controls SHALL remain usable.
Unknown, loading and failed checks MUST NOT be presented as confirmed access
denial or guessed permission. Permission acquisition, caching and automatic retry
behavior remain separate definitions.

#### Scenario: Permission information is being checked

- **WHEN** access to navigation or content depends on a pending permission check
- **THEN** that area shows a neutral loading state
- **AND** unrelated controls remain usable.

#### Scenario: A permission check fails

- **WHEN** permission information cannot be checked for an affected area
- **THEN** the affected content shows the error once with Retry, without repeating it in the sidebar
- **AND** it does not claim that the member lacks access or that the business result is empty.

#### Scenario: A direct-link permission check is unresolved

- **WHEN** a directly requested section depends on unresolved permission information
- **THEN** its affected content uses the loading or error state appropriate to the check
- **AND** confirmed access denial is reserved for known denial under NAV-006.

### Requirement: NAV-008 — Independent location scope per Inventory page

Each relevant Inventory page SHALL control its own location selection and show
its current scope near the heading. Changing that selection MUST NOT implicitly
switch another page's selected scope. Stock locations SHALL remain distinct from
sites. Defaults, remembering choices, selection cardinality, aggregate views,
business switching and mutation targets require separate decisions.

#### Scenario: A merchant changes a page's location scope

- **WHEN** the merchant changes the location selection on a relevant Inventory page
- **THEN** that page shows and uses its selected viewing scope
- **AND** the change does not implicitly switch the selected scope on another page.

#### Scenario: A shop has more than one stock location

- **WHEN** a page identifies a shop's sales floor or stockroom as its stock location
- **THEN** the selected scope remains visible near the heading
- **AND** that location is not presented as necessarily covering the whole shop.

### Requirement: NAV-009 — Location defaults and per-tab remembering

For initial page viewing scope, a sole known accessible location SHALL be selected
automatically. With several accessible locations and no selection, the page
SHALL request a choice before location-dependent results. Each page's explicit
choice SHALL be remembered while the tab stays open, with scope always visible.
Closing the tab SHALL end that retention. Mutation targets and the storage
mechanism are outside this decision.

#### Scenario: Only one location is accessible

- **WHEN** the page needs an initial viewing scope and exactly one accessible location is known
- **THEN** the page selects it automatically
- **AND** its viewing scope remains visible.

#### Scenario: Several locations need a first choice

- **WHEN** several accessible locations are available and the page has no selected scope
- **THEN** the page asks the merchant to choose before displaying location-dependent results
- **AND** it does not guess a location.

#### Scenario: A merchant returns to a page in the same tab

- **WHEN** the merchant returns to a page with an explicit location choice while the same tab stays open
- **THEN** that page remembers its own choice and shows the selected scope
- **AND** remembering a choice does not grant access or establish continued location validity.

#### Scenario: The tab is closed

- **WHEN** the merchant closes the tab
- **THEN** this per-tab retention ends
- **AND** this decision does not establish a cross-tab or long-term preference.

### Requirement: NAV-010 — First navigation prototype layout

The Storybook navigation prototype SHALL place Inicio at the top, Inventario in
the middle, and Explorar módulos, Configuración del negocio and Ayuda at the
bottom. It SHALL retain TailAdmin's desktop sidebar and tablet/mobile drawer,
closing the drawer after a destination is chosen. Access/location states SHALL
be simulated and destination content neutral. Production routes, integrations
and stock-changing actions are outside this prototype.

#### Scenario: A merchant reviews the desktop layout

- **WHEN** the desktop navigation prototype is shown
- **THEN** its entries use the selected top, middle and bottom placement
- **AND** the previously selected access and module-group behavior applies.

#### Scenario: A merchant selects a destination in the drawer

- **WHEN** a destination is selected in the tablet/mobile drawer
- **THEN** the prototype displays that destination and closes the drawer
- **AND** its location scope follows the page-owned selection rules where relevant.

#### Scenario: The prototype is reviewed visually

- **WHEN** the Storybook preview or its captures are reviewed
- **THEN** access/location information is identified as simulated and content remains neutral
- **AND** capture success does not approve images or implement production destinations.

### Requirement: NAV-011 — Compact module controls fit the sidebar rail

The Inventory module trigger SHALL match neighboring menu controls in compact
footprint, padding, icon dimensions and alignment. Its icon SHALL also match
neighboring icon dimensions when expanded. Its right-hand caret SHALL be hidden
in the compact rail and available with expanded labels. This correction SHALL
retain the existing TailAdmin sidebar interaction and accessible module control.

#### Scenario: The sidebar is compact

- **WHEN** the desktop sidebar is collapsed without temporary hover expansion
- **THEN** the Inventory control fits within its containing rail
- **AND** its button and icon match the neighboring compact controls without retaining caret space.

#### Scenario: The sidebar is expanded

- **WHEN** the module label and caret are visible
- **THEN** the Inventory icon has the same dimensions as neighboring menu icons
- **AND** the expanded group control remains accessible.

#### Scenario: A keyboard user activates compact Inventory

- **WHEN** the keyboard user activates Inventory in the compact rail
- **THEN** the rail and Inventory group open together with its items visible
- **AND** the control's announced expansion state matches the visible panel.

### Requirement: NAV-012 — One content-area access-check error

A failed permission check SHALL show one clear error with Retry in the affected
main content. The sidebar SHALL NOT duplicate that error message or an additional
error control. Neutral loading and known access denial SHALL retain their
distinct meanings. This supersedes the prototype's duplicated sidebar/content
error presentation while preserving the scoped failure behavior in NAV-007.

#### Scenario: A permission check fails in either sidebar state

- **WHEN** the permission-error preview is shown with an expanded or compact sidebar
- **THEN** one error and Retry action appear in the main content
- **AND** neither an error message nor another error control is repeated in the sidebar.

### Requirement: NAV-013 — Efficient page space for information-rich work

The revised navigation preview SHALL use a compact, available-width page frame
suited to future information-rich tables. It SHALL put title and location scope
in a slim toolbar, inline where space permits, and remove the large empty card
and always-visible prototype notice from the page. Fixture notices SHALL live in
Storybook documentation. Readable text and existing control sizes SHALL be
preserved; table columns, row density and editing remain separate decisions.

#### Scenario: Products is reviewed before its content is designed

- **WHEN** the Products preview is shown
- **THEN** its compact frame leaves the content area available for future work
- **AND** it does not add an empty display card, forced content height or invented table data.

#### Scenario: A page requires location scope

- **WHEN** location selection is shown beside a page title
- **THEN** the toolbar uses available width and adapts to the viewport
- **AND** location controls retain their readable labels and existing sizes.

### Requirement: NAV-014 — One compact toolbar with visible page controls

The preview SHALL combine the menu button, page title, location selector where
applicable and theme button into one compact toolbar. Controls SHALL remain
visible at the sizes selected under NAV-016 without requiring hover activation. Location
controls SHALL follow the single-row phone refinement under NAV-019. The separate two-button header row SHALL
be removed from the preview; the reusable production header remains unchanged.

#### Scenario: A desktop Inventory page is reviewed

- **WHEN** the page has location scope
- **THEN** its title, location selector and global controls share one compact toolbar
- **AND** there is no separate row containing only the menu and theme buttons.

#### Scenario: The pointer leaves the toolbar

- **WHEN** the toolbar is not hovered or the user interacts with a touch device
- **THEN** its controls remain visible and usable
- **AND** its location controls adapt to fit the available width under NAV-019.

### Requirement: NAV-015 — Narrow centred collapsed rail

The preview's collapsed desktop rail SHALL be 64px wide, with centred 44px square
action targets and 16px icons. Its content inset SHALL match that rail width,
without reserving the old 90px gap. Compact gutters SHALL be balanced around the
controls. Expanded sidebar and tablet/mobile drawer widths SHALL remain unchanged.
This refinement applies only to the preview, not shared production primitives.

#### Scenario: The whole rail is collapsed

- **WHEN** the desktop rail has settled into its compact state
- **THEN** its width and the content inset are 64px
- **AND** compact navigation controls are centred 44px targets with 16px icons and balanced gutters.

### Requirement: NAV-016 — Lightweight responsive header actions

The preview menu and theme actions SHALL use borderless buttons with 16px icons
and subtle hover/focus backgrounds. Targets SHALL be 36px square on desktop and
44px on tablet/mobile, using the existing sidebar breakpoint. Accessible labels,
focus visibility, theme behavior and drawer interaction SHALL be preserved.
Location-selector sizes SHALL follow the thinner control under NAV-018.

#### Scenario: Header actions are reviewed across sizes

- **WHEN** the desktop or tablet/mobile toolbar is shown
- **THEN** the action targets use their selected responsive sizes with 16px icons
- **AND** controls stay visible without requiring hover.

### Requirement: NAV-017 — Collapsible shared footer

The shared footer SHALL be foldable under “Más opciones”, initially open in the
preview. Its explicit toggle SHALL expose or hide the selected shared links and
accurately announce expansion. It SHALL work with pointer and keyboard in both
sidebar forms and remain separate from module-group expansion. No account-level
or cross-session persistence is selected by this local preview state.

#### Scenario: A merchant folds and reopens the shared footer

- **WHEN** the merchant activates the footer toggle
- **THEN** the shared links fold or reopen without changing module expansion
- **AND** the three selected destinations remain reachable when the footer is reopened.

### Requirement: NAV-018 — Thinner desktop location selector

The preview's desktop location selector SHALL use the retained small-control
variant, 36px high, to align with its compact header actions. Tablet/mobile SHALL
retain the existing 44px target. Text size, accessible labeling, available
locations and independent page selection SHALL remain unchanged. This implements
the user's request for a thinner Ubicación control without changing production
form primitives.

#### Scenario: A page shows its location control

- **WHEN** the location selector is displayed in the desktop toolbar
- **THEN** its height is 36px with the existing readable text
- **AND** the tablet/mobile version retains its 44px target and selection behavior.

### Requirement: NAV-019 — One compact phone toolbar with location scope

Below 640px, the preview SHALL keep menu, title, location and theme on one row
without overlap or horizontal overflow. Use the translated location label as the
empty prompt and retain its accessible label. Text MAY use ellipsis; full names
SHALL remain available in the dropdown. Menu/theme SHALL remain 44px square;
selector sizing follows NAV-020. Preserve desktop appearance and location behavior.

#### Scenario: A merchant chooses among several locations on a phone

- **WHEN** the scoped page is shown at a narrow phone width
- **THEN** all header controls and the title remain on the same row
- **AND** the short location prompt appears before a choice is made
- **AND** all available location names can be read and selected in the dropdown
- **AND** the chosen location remains accessible without changing page-owned scope.
- **AND** existing choices and per-tab retention semantics remain unchanged.

#### Scenario: A long title or location name is shown

- **WHEN** phone text needs more width than the compact toolbar allows
- **THEN** it may use visual ellipsis while its full text remains accessible
- **AND** full location names are readable in the dropdown.

### Requirement: NAV-020 — Slim phone selector with retained touch area

Below 640px, the location selector SHALL appear 36px high with unchanged text
size and a 44px-high pointer target. Keep the single-row toolbar and accessible
label. Tablet and desktop selector appearance SHALL remain unchanged.

#### Scenario: A merchant touches the slim selector

- **WHEN** the merchant taps within the extra 4px above or below the visible control
- **THEN** its location dropdown opens normally
- **AND** the visible control remains 36px high without shrinking its text.

### Requirement: NAV-021 — Full-width location option rows

The location dropdown SHALL use contiguous full-width option rows, at least
44px high. Hover, keyboard highlight and selection SHALL cover each entire row
inside the popup border, with no inset rounded-button treatment or gaps.
Preserve full names, selected indicators and native select interactions.

#### Scenario: A merchant hovers or selects a row near the popup edge

- **WHEN** the pointer enters the left or right edge of an option row
- **THEN** that row receives the full-width highlight
- **AND** clicking there selects its location.

#### Scenario: A merchant uses keyboard navigation

- **WHEN** the merchant moves through location options with the keyboard
- **THEN** the active row uses the same full-width treatment
- **AND** native selection and dismissal remain available.
