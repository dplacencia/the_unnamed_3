# Core Sites and Areas review

In Configuración del negocio, **Centros y áreas** presents Core's shared
hierarchy independently of each module's resources. Names can repeat. The
preview uses stable IDs for navigation, parentage and mutations. Area-only
viewers see the Areas and parent facts available to them. The latest Core design
S137 includes the canonical parent's current zone in the authorized Area list.
The parent name and zone do not grant access to its other Areas or Site controls.
[Shared hierarchy and scoped discovery](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/specs/merchant-access/spec.md#requirement-mer-041--shared-resource-discovery-follows-held-scopes)

The Owner archive-list review opens with active Sites and Areas. Each list has
its own active/archived/all filter and its own continuation position. Archived
Areas can be selected under an active Site without exposing archived Sites in
the ordinary list. Two fixture items per page make the navigation reviewable.
Live list requests use the returned opaque tokens for the current collection
and filter. [Archive selection](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/specs/merchant-access/spec.md#requirement-mer-039--shared-archived-resource-list-visibility)

An Owner can create a Site with its first named Area and an explicit IANA
default zone. The synthetic result creates both records together. The
separate create-Area action requires an active Site. Site editing covers
name and default zone. Area editing covers its name. Site defaults do not
change Inventory calendars.
[Creation and updates](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/specs/merchant-access/spec.md#requirement-mer-040--shared-site-and-area-api-routes) · [Site zone](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#requirement-mod-010--time-changes-preserve-recorded-meaning)

The form follows S123 for name trimming, 255 Unicode code points, and
retained control characters. The preview uses the browser's zone data to
exercise valid names and aliases, refuses offsets, and keeps the submitted
spelling. Core's supported IANA set and exact validation govern the live
result. [Core zone spelling](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/design.md#s125--preserve-accepted-iana-zone-spelling)

An archive panel presents the outcome of the owning-module checks for
every affected Area. The first review fixture includes Inventory. An open
stock location or unavailable required answer pauses submission. A Core
refusal of an archive leaves the view's hierarchy intact. Restore Site
requires the Owner to choose one archived Area from that Site. The
successful result restores the two original identities and keeps other
archived siblings. A separate Area restore requires an active parent.
[Lifecycle and confirmation rules](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#requirement-mod-003--identity-and-history-survive-lifecycle-changes)

The reference-blocked archive preview shows a confirmed Core refusal after an
Inventory check reports no open stock location. The hierarchy and the
referencing assignment or pending selection keep their prior state. No
reference detail or cleanup action is inferred from the refusal. Live use must
present this reason only when the response establishes it. A generic conflict
can use the existing refusal presentation.

An unconfirmed creation fixture retains a proposed Site name, zone and first
Area with the original creation operation. An additional Area can exercise
the same state with its retained parent Site and Area name. Retry is explicit
and carries that exact original request. The fixture shows the new resource
only after the supplied confirmation. New create actions remain unavailable
while the existing creation is unresolved. This fixture models S127–S128
and leaves production persistence and transport to the approved contract.
[Creation replay](../../../../the_unnamed_2/openspec/changes/merchant-role-administration/design.md#s127--require-a-caller-operation-id-for-site-and-area-creation)

The published hierarchy is authoritative for this review. The current
Inventory-local Site/location API uses its own resource identities. The
live workspace needs Core list and write routes, the Area-to-Inventory
stock-location read, and current scoped evidence for archive. The mock
adapter does not fix Core response shapes that remain open.
[Current binding limits](../../../../the_unnamed_2/openspec/specs/module-architecture/spec.md#L227)
