# Products recovery: retry and browser-persistence decisions

## Authority and scope

After PT-028–033 were recorded, the user said **“go ahead”** to the recommendation
to define retry-budget and browser-storage details before implementing recovery
states in Storybook. This continues the decision/design stage. No code,
dependency installation, image promotion, staging or commit follows automatically.
The selected [functional recovery direction](design.md#inventory-retry-findings-and-selected-recovery-direction--2026-11-14)
remains applicable. New choices below are proposals until their actual selection
is recorded. OpenSpec in this repository remains the definition home.

## Source check — 2026-11-14

### Existing repository behavior

- The frontend editor is still synthetic and stores drafts/results in React
  memory. Existing sessionStorage holds tab-scoped view/location preferences;
  localStorage holds theme preferences. Those preference scopes are not a
  recovery journal or the selected browser-wide draft/command behavior.
- The [Inventory caller contract](../../../../the_unnamed_1/openspec/specs/inventory-operation-identity-retries-contract/spec.md#requirement-preserve-caller-attempt-obligations)
  requires finite attempt deadlines and unchanged full identity/content but
  does not select counts, backoff or automatic retry policy.
- Current [application configuration](../../../../the_unnamed_1/inventory/application/src/config.rs)
  has five internal database attempts by default, configurable from one to twenty.
  Its 1000ms default connection-acquisition wait is not a request deadline.
- The [application time-limit account](../../../../the_unnamed_1/inventory/application/README.md#time-limits)
  states that the API has no request/handler/statement deadline. The existing
  native client has a 15-second request timeout; that is a reference for this
  proposal, not a frontend requirement or measured browser latency.

Sibling inspection is read-only at HEAD
`7240bfa0136cbe889146cdc243149a5160b94afa`; the configuration and application README
contain uncommitted owner changes. These are current source observations, not
runtime certification, adoption of unseen owner decisions or authority to change
that repository. Frontend retries and those internal attempts are separate layers;
no backend setting is changed or copied as the frontend attempt count.

### Browser and retry references

Retrieved on 2026-11-14:

- [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API):
  asynchronous structured records and local transactions. This supports the
  engine recommendation; it does not provide cross-user authorization or a
  durability guarantee against storage deletion.
- [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API):
  localStorage/sessionStorage are synchronous string stores; repeated large
  read/write operations can block the interface.
- [MDN storage quotas/eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria):
  browser data is best-effort by default and can be evicted or cleared; private
  browsing usually removes it when that session ends. Persistence requests are a
  separate browser facility with browser-dependent approval.
- [MDN transaction completion](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/complete_event)
  and [transaction durability](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction#firefox_durability_guarantees):
  observe completion of the local transaction rather than one request's success;
  completion must not be presented as protection from every power/device failure.
- [AWS retry guidance](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/):
  retries at several layers multiply load, and timeout selection needs actual
  latency evidence. Backoff/jitter limit synchronized retry bursts. These support
  a small bounded frontend profile, not a claim that a proposed number is proven.

No browser qualification, latency test or live mutation was run in this decision
step. Existing Mac Chromium visual coverage remains its previously stated scope.

## Selected initial retry profile

Recommended starting profile for prototype/client qualification:

| Setting                                      | Selected profile                                              | Lean alternative                              |
| -------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------- |
| Frontend attempts in an initial recovery run | 3 total: original + at most 2 automatic retries               | 2 total: original + at most 1 automatic retry |
| Client timeout per request attempt           | 15 seconds                                                    | 15 seconds                                    |
| Wait before first retry                      | 1 second, randomized by ±50% (500–1500ms)                     | Same                                          |
| Wait before second retry                     | 3 seconds, randomized by ±50% (1500–4500ms)                   | No second retry                               |
| On exhaustion                                | Keep unconfirmed result and original command; manual recovery | Same                                          |

The exact question presented was:

> For the initial frontend retry profile, I recommend 3 attempts total (original + 2 retries),
> 15 seconds per attempt, with waits of 1 then 3 seconds randomized by ±50%. Keep one
> frontend request active per command, then retain uncertainty and offer manual
> recovery when the budget ends. Prefer this, or a leaner 2-attempt profile with the
> same timeout and first wait? This is a starting profile to validate against the
> real API, not a completion guarantee.

The user chose **“3 total attempts (Recommended)”**. PT-034 selects the recommended
profile: original request plus at most two automatic retries; 15-second client
attempt deadlines; nominal 1-second then 3-second waits randomized by ±50%
(500–1500ms and 1500–4500ms); no deliberately concurrent frontend attempts of the
same command. The two-attempt alternative remains historical. PT-038 below
selects the manual-run budget; transport mapping and live latency qualification
remain separate.

These are client-attempt limits. Browser timers may be delayed and no exact
wall-clock completion/availability guarantee is claimed. One active frontend
request per command means no deliberate hedging/duplicate timer; it does not
prove a timed-out remote attempt has stopped. Same-identity safety remains
necessary. Do not replace an unknown outcome with failure or cancellation.

Automatic repeats concern technical uncertainty, not authoritative business
rejection. A current-context/preflight refusal stops that recovery attempt without
proving the original operation failed. No generic HTTP-code retry map, offline
queue, network-return auto-resumption or changed request is selected. PT-031's
explicit continuation after refresh/reopening remains in force.

PT-038 below selects a newly authorized bounded run for each explicit manual
retry/continuation after a stopped run. It does not silently reset an active run
or replace its logical command. Backend internal attempts remain separate; the
eventual transport must account for any transparent retry behavior rather than
letting invisible extra frontend attempts bypass this budget.

## Preferred browser-storage engine, with compatibility clarification

Recommend IndexedDB for the retained command and draft records. Its asynchronous
structured storage and transactions fit atomic local changes from draft state to
an immutable submitted command plus recovery metadata. Keep those data concepts
separate; PT-033's review concerns never-submitted drafts, not rebuilding a
submitted command.

The alternative is localStorage for a simpler small string store. A single write
can store a whole JSON object, but multi-record changes and cross-tab
read/modify/write would need additional coordination. Existing catch-and-ignore
preference writes are insufficient to claim recovery records were retained.
Neither engine solves another user's or business's access scope by itself.

The exact question now presented is:

> For retained drafts and operation records, I recommend IndexedDB: structured
> records, asynchronous access and transactions for local updates. localStorage
> is a simpler string store but needs extra coordination for concurrent changes.
> Which should we use? This selects the storage engine only; failure handling,
> cross-tab behavior and retention details follow separately. Browser data can
> still be cleared or evicted.

The user chose **“IndexedDB (Recommended)”**, recorded as PT-035. Their subsequent
compatibility clarification below makes this the preferred engine when usable,
not an application prerequisite or an exclusive storage dependency. Compatible
fallback behavior must also be designed. No wrapper library is selected.

This selects neither a wrapper library/new dependency nor record schema, browser
support certification, storage limits, encryption/key handling or persistence
permission requests. View/location preferences retain their separately selected
per-tab behavior; this proposal concerns business drafts and operation records.

### Rejected IndexedDB-only pre-dispatch gate

The next question presented is:

> I recommend requiring a successful IndexedDB transaction before sending a save
> or retry. If it fails, send nothing new, keep the draft and show a local-storage
> error. If a later storage update fails after Inventory has confirmed a result,
> keep that known business result and report the storage problem separately.
> Prefer this safeguard, or offer an explicit session-only exception that cannot
> promise recovery after reopening?

The user did not select either original option as worded. They replied:

> That adds another requirement to the system, which is risky. Lets suppose the
> browser is not compatible with indexedDB or it fails for some reason, then the
> system just blocks? NO, we must be flexible. Lets design the behaviour also for
> when IndexedDB is not available. Compatibility is very important here

The hard IndexedDB-only precondition is rejected. PT-036 records that
compatibility constraint and qualifies PT-035 as a preferred engine. The exact
fallback chain and session-only behavior were not selected by that correction
alone. The subsequent specific selection below supplies their scope; migration,
locking and unpresented retention mechanisms remain separate.

### Selected capability-based fallback design

The selected path tries the best usable storage capability for each required record:

| Available capability                          | Business workflow                              | Local draft/recovery behavior                                                                                                                         |
| --------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| IndexedDB usable                              | Normal explicit save and same-command recovery | Preferred structured, transactional local records; acknowledge retention only after the applicable write completes                                    |
| IndexedDB absent/failing; localStorage usable | Continue through a localStorage adapter        | Store self-contained command snapshots and drafts in the same browser/business/user scope; never claim IndexedDB multi-record or cross-tab guarantees |
| No usable persistent store                    | Continue in memory                             | Keep original commands, drafts and outcomes within this open app instance; clearly explain that reload/close/crash cannot promise restoration         |

Access, local validation, exact values and actual Inventory capability limits
apply in every mode. A storage failure alone does not turn a save into business
failure or block unrelated app work. The selected fallback keeps explicit Save
and same-command recovery usable with an accurate, nonblocking retention notice;
no extra confirmation on every Save is proposed. Interface copy/placement remains
a later visual-review choice. The engine name need not be exposed in merchant UI.

#### Runtime capability and record truth

Check usable operations and handle errors, not just API-property presence or a
browser-name guess. Storage can exist but deny access or fail on a write. Keep
readable history distinct from writable capability, and track whether each record
has a confirmed persistent copy or is currently memory-only. Do not globally label
all records retained merely because a storage API exists.

Before adapter work, retain the full original command and its observed result in
memory above transient panels/routes. A fallback must copy that unchanged command,
never mint a replacement identity, rebuild its payload from later edits, erase
known uncertainty or downgrade an authoritative confirmed result. Storage failure
after a response is a separate local-retention problem.

An inaccessible old store is unavailable history, not an empty journal or proof
there were no unresolved saves. Keep known unresolved-product protections and
report unavailable earlier records without imposing an app-wide IndexedDB gate.
Recovery of a particular old command still requires its original identity/content;
new explicit business intent must not be disguised as recovery of that command.

If the original store later becomes accessible, examine recovered records within
their business/user scope and reconcile by full operation identity and immutable
content. Do not automatically send them, choose between conflicting copies by
latest timestamp, overwrite known confirmation, delete fallback copies or erase
submitted records when an unsent draft is discarded. Exact reconciliation and
shared-tab ownership are not selected by this chain.

#### Honest limits

Browser-local persistence remains subject to availability, eviction, browser-data
clearing and private-session lifetime. The PT-031–032 reopening behavior can only
restore an accessible retained copy. Memory-only mode supports this open app's
recovery, not reopening or another tab; it must not present those unavailable
capabilities as successful retention. A known server-confirmed result remains
confirmed regardless of local capability.

This selected fallback path does not by itself provide cross-tab exclusion,
shared counters, field-comparison/versioning, record expiry/clearing, persistent
storage permissions or a guarantee for every browser version. The installed
backoffice uses Next.js 16.3.4; the current
[Next.js browser-support documentation](https://nextjs.org/docs/architecture/supported-browsers)
is a framework reference, not a certified browser matrix for this locked app.
Compatibility includes JavaScript/CSS/runtime requirements as well as storage;
no dependency upgrade, polyfill policy or browser-version target is selected here.

#### Sources and planned qualification

The added [MDN availability guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage)
explains why property presence is insufficient; an actual storage operation can
be denied or quota-limited. The
[localStorage exception documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions)
identifies policy-related SecurityError. Retrieved 2026-11-14. These support
capability detection, not a claim that fallback code or browser qualification ran.

Before implementation acceptance, plan focused checks for: no IndexedDB property;
open/transaction failure; readable-but-not-writable storage; localStorage access
and quota errors; neither persistent API usable; mid-recovery degradation with
unchanged identities/counts; authoritative success followed by local-write failure;
inaccessible/late old history; no cross-business/user restoration; and current-app
memory surviving ordinary panel/route changes. Cross-tab concurrency needs its
separately defined policy before claiming its guarantees. Canonical screenshot
renderer settings remain unchanged.

The exact chain, nonblocking notice and session-only write behavior were selected
with **“Use this fallback design (Recommended)”** to the following question:

> Shall we use this fallback design: IndexedDB when usable, then localStorage,
> then memory-only operation if persistent storage is unavailable? Normal saves
> and retries of known original commands stay available, with an accurate
> nonblocking retention notice; memory-only mode cannot promise recovery after
> refresh or closing. This selects the fallback behavior, not cross-tab locking,
> store reconciliation or a guarantee for every browser version.

PT-037 records that selection: IndexedDB when usable, then localStorage, then
memory-only operation; normal saves and retries of known original commands stay
available with an accurate nonblocking retention notice. Memory mode makes no
refresh/close recovery promise. Cross-tab locking, reconciliation and all-browser
certification remain unselected. No compatibility adapter, journal, request or
UI is implemented.

## Verification checkpoint

At this verification checkpoint, the numeric profile and storage alternatives
were still unselected. The subsequent PT-034 choice above selects the retry
profile, and PT-035 initially selected IndexedDB. The subsequent compatibility
clarification rejects making IndexedDB a prerequisite. The capability-based
fallback design was then proposed; the subsequent PT-037 selection above adopts
the chain and capability notice without adopting coordination algorithms. Independent read-only review found
no material factual/authority issue; a stale context phrase
was corrected to distinguish settled functional choices from the pending numeric
question. All seven changes pass native strict OpenSpec validation; formatting
and 134 local links/anchors pass. Exactly nine documentation/context files differ
from `eb49dea`; the index is empty. Application/dependency/visual sources remain
unchanged at `e583af90…`, with 628 accepted references. Code/browser tests and
builds were not repeated for documentation-only work. No sibling writes, new
prototype, image acceptance, staging or commit occurred.

### Compatibility review checkpoint

Independent review found the fallback proposal did not adopt its pending chain or
promise IndexedDB transactional/cross-tab guarantees for localStorage. Current
pointers were corrected to mark the hard gate rejected and qualify restoration
by accessible retained copies. All seven strict changes, formatting and 134 local
links pass for this nine-file documentation-only revision. The exact fallback
question was still pending at that review; the later PT-037 choice adopts the
chain above. The prototype, dependencies, 628 accepted references,
empty index and HEAD `eb49dea` remain unchanged; no new browser/runtime tests or
implementation claims follow from this documentary review.

## Selected manual recovery run budget

The user selected **“New bounded run per manual action (Recommended)”** under
PT-038. After a stopped recovery run, explicit Reintentar or Continuar recuperación
authorizes another run of at most three requests using the original full operation
identity and frozen content, with PT-034's 15-second client timeout and 1/3-second
waits randomized by ±50%. The first request in this run is still a retry of the
same logical business operation. The one-attempt alternative is historical.

No new run starts automatically when the budget ends. Another explicit request
can authorize another bounded run after the previous one stops; the selection
does not authorize resetting or deliberately overlapping an active run. An
inconclusive run preserves uncertainty and the same original command. Current
authority, supported-method limits and the distinction between rejection and
uncertainty remain applicable. PT-031 explicit continuation on return and PT-037
retention limits remain in force. PT-039 below defines shared-tab behavior under
actual coordination capability. Ownership/enforcement mechanisms and real-API
qualification remain separate; client timeout does not prove remote work ended.

The question answered was:

> After a recovery run has stopped, I recommend letting an explicit “Reintentar”
> or “Continuar recuperación” start another bounded run: up to 3 requests, using
> the same original operation identity and content, with the agreed timeout and
> waits. It would never restart automatically without another request. Prefer
> this, or one 15-second attempt per manual action?

Options were **New bounded run per manual action (Recommended)** and **One attempt
per manual action**. The user's first-option selection establishes only the
manual-run policy above; no code, dependency, visual-reference or staging change
is adopted by this documentary choice.

## Selected shared-tab recovery behavior

Primary browser references checked on 2026-11-14 distinguish coordination from
storage. [Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API)
can coordinate same-origin work through an exclusive named lock where usable;
this is not a selected adapter or a runtime support qualification.
[Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
provides same-origin/partition messaging, leaving message semantics to the app.
It is not by itself an exclusive lock or retained command history. The
[HTML Web Storage standard](https://html.spec.whatwg.org/multipage/webstorage.html#introduction)
warns authors to assume no locking for localStorage shared state. These sources
do not establish a universal cross-tab guarantee or require any new dependency.

The user selected **“Coordinate when possible; usable fallback (Recommended)”**
under PT-039. This concerns the same original unresolved command, not simultaneous
unsent editing of the same product. Show another known active recovery run and
avoid starting a second deliberate run while it is known active. When coordination
cannot be used, same-command recovery remains available in the current tab with
an honest capability limitation; missing status is not proof no other run exists.
Ordinary browsing and other eligible work stay available under existing rules.
The stricter alternative requiring reliable coordination for recovery in another
tab is historical. No concrete ownership/locking algorithm is selected.

The question answered was:

> For recovery of the same original command across tabs, I recommend showing when
> another tab is known to be running recovery and avoiding a second deliberate
> run. If browser coordination is unavailable, keep recovery usable in the current
> tab with a clear limitation notice. Other work stays available. Prefer this, or
> require reliable coordination before recovering that command in another tab?
> Simultaneous unsent editing of one product remains a separate decision.

Options were **Coordinate when possible; usable fallback (Recommended)** and
**Require coordination for recovery in another tab**. The user's first-option
selection adopts the behavior above. It does not adopt a mechanism, new
same-product editor restriction or global single-run guarantee. Within one app,
the PT-034/038 prohibition on deliberately concurrent same-command attempts/runs
remains. Across tabs, known activity is respected; unavailable coordination cannot
prove exclusivity or absence of another run, and does not become a new app-wide
requirement under PT-036/037.

Storage events, messages or an apparently missing owner do not by themselves
authorize a new recovery run, reset counters or prove remote work ended. Any later
explicit continuation still requires the original full command, current authority
and PT-038's bounded-run policy. Unavailable retained records cannot be rebuilt
from current edits. No automatic merge/overwrite of unsent drafts or new
one-editor-per-product rule follows. Implementation, dependency installation,
visual changes, staging and commits are outside this documentary selection.

## Second-editor rejection — user correction

The earlier independent-drafts recommendation was not selected. In response to
the question quoted below, the user said:

> Second editting over the same product must be rejected with a clear message
> error, note that the tab that did the edition may be closed so we need to
> discuss a discard or assume flow here

The question answered was:

> If two tabs edit the same product before saving, I recommend keeping separate
> drafts, with no silent merge or replacement. On return, if several retained
> drafts are accessible, let the merchant choose which to continue. Prefer this,
> or one known editing tab with an explicit handoff when coordination is available?

The offered options were **Separate drafts; choose on restoration (Recommended)**
and **One known editing tab with explicit handoff**. The user's custom reply
rejects the first direction and establishes PT-040: a second edit of the same
product must be rejected with a clear error. It also requires discussing a
resolution flow that accounts for the original editing tab being closed. It does
not by itself approve any takeover/discard actions, a lease/expiry duration,
automatic ownership release, forced takeover of a live editor or a mechanism.

This continues the same-browser/business/user cross-tab discussion. It does not
by itself select a platform-wide lock across teammates/devices. The desired
second-editor rejection is not weakened to independent editing, and no tested
global enforcement guarantee is claimed. Editing ownership when coordination is
unavailable remains a concrete unresolved design issue alongside PT-036/037's
compatibility requirements; PT-039's recovery fallback does not automatically
settle that editing policy.

Preserve the distinction between these cases:

- **A known active editor:** explain that another edit prevents starting a second
  one. Do not silently open another editor or replace its draft.
- **A retained unsent draft after its original tab closes:** account for explicit
  resolution without requiring that closed tab to answer. PT-032/041 below
  supply explicit continuation/discard actions; ownership enforcement remains
  separately defined.
- **Unknown owner activity:** state what is known about the retained edit without
  asserting that the tab is open or closed. Missing status does not authorize an
  automatic discard or prove that the editor stopped.
- **A submitted or unresolved save:** preserve its frozen command and PT-029
  read-only protection. Discarding a never-submitted draft does not cancel,
  reverse, erase or resolve submitted work.

The first/third cases are design distinctions needed for honest wording, not
approval of a new heartbeat, timer or ownership mechanism. Exact message wording
also remains a proposal.

### Browser evidence relevant to a closed editing tab

Primary references checked on 2026-11-14: MDN documents that
[beforeunload is not reliably fired, especially on mobile](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#usage_notes).
A browser close callback therefore cannot be the only basis for retaining a
draft or resolving its ownership. The current
[Web Locks Editor's Draft](https://w3c.github.io/web-locks/#lock-termination)
describes releasing locks during document/agent termination; it is a work in
progress and does not establish retained-draft lifecycle or business completion.
The inference for this design is to separate retained work from a live browser
lock; no Web Locks adapter, close-detection guarantee or retention policy is
adopted here.

### Selected unknown-owner resolution

The user selected **“Explicit resolution when owner is unreachable (Recommended)”**
under PT-041. PT-032's existing continue/discard choice is retained. For an
accessible retained unsent draft whose prior editor is unreachable with unknown
status, the selected explicit resolution uses:

- **Asumir edición:** continue the existing accessible draft, preserving its
  baseline and applying PT-033's current-data review before saving when needed.
- **Descartar borrador y empezar de nuevo:** require explicit confirmation, then
  abandon only that unsent draft and use current product data for a new edit.
- **Cancelar:** leave the retained work untouched and do not open another editor.

This selects the explicit action behavior, not an ownership-transfer algorithm. When recovery records exist, PT-029 protection
must still be honored; discarding an unsent draft is not a way around it. Without
an accessible retained copy, the interface cannot claim to continue that draft
or successfully discard inaccessible work. A confirmed ended session and an
unobservable owner are distinct cases; known active editors retain the requested
second-edit rejection.

PT-041 permits requested takeover or confirmed discard in that unknown-owner
case, with an explicit ownership change: a prior editor that returns must be
read-only rather than continue editing/saving as the old owner. This is a required
selected behavior, not a claim a browser mechanism already enforces it. The
alternative requiring a confirmed ended session is historical. Neither takeover,
discard nor a fresh editor starts automatically, and explicit resolution does
not prove the old tab actually closed. Current access/validation and PT-029's
unresolved-product protection remain applicable.

The question answered was:

> For an unsent draft, if the original tab cannot be reached and its status is
> unknown, I recommend allowing an explicit Asumir edición or confirmed Descartar
> y empezar de nuevo, with the previous editor made read-only if it later returns.
> Known active editors would still block a second edit. Prefer this, or allow
> takeover/discard only once the earlier editing session is confirmed ended?

Options were **Explicit resolution when owner is unreachable (Recommended)** and
**Resolution only after the session is confirmed ended**. The user's first-option
selection adopts the behavior above. The ownership check/transfer mechanism and
editing behavior when coordination is unavailable must be defined and qualified
before an enforcement claim. PT-039's usable recovery fallback does not silently
authorize a second editor. No automatic release, discard, takeover, lease duration,
new API, UI, dependency or implementation follows from this documentary choice.

## Next phase — bounded simulated preview prepared for review

The [concrete preview plan](recovery-preview-plan.md) makes the selected recovery
and ownership behavior reviewable without pretending that production storage or
cross-tab mechanisms exist. It includes a deterministic command/run model,
TailAdmin presentation, virtual old-owner return, five-language/responsive/theme
coverage and the existing candidate/approval workflow. Preparing the plan does
not authorize its execution or acceptance of future images. Keep the remaining
production tasks open; no further technical preference question blocks drafting
or reviewing this explicitly simulated plan.

Next proposed selection: build that bounded simulated Storybook preview now
(recommended), or define production coordination/retention mechanisms first.
The plan is ready for this scope decision; neither execution nor image approval
is inferred from PT-041.

### Bounded preview execution selected — 2026-11-14

The user selected **“Build the simulated preview (Recommended)”**. The
[preview plan](recovery-preview-plan.md#execution-authorization--2026-11-14) is now
authorized for synthetic commands, simulated storage/ownership and candidate
visual review. This supersedes earlier pending execution wording only; actual
production mechanisms, new dependencies, image acceptance, staging and commits
remain outside scope.

### Simulated preview implemented and ready for review — 2026-11-14

The authorized [bounded preview](recovery-preview-plan.md#execution-and-verification--2026-11-14)
is implemented and verified with 84 code tests, 124 browser checks, 172 new
candidate captures and 607 unchanged-reference comparisons. Source `2058ed78…`,
exact run identities, resolved review findings, local build/font preparation
corrections and simulation limits are recorded there. The exact 172-image gallery
is pending user approval. The 628 accepted references, separate navigation review,
production-policy gaps and never-commit boundary retain their status.
