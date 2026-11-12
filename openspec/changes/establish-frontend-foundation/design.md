# Foundation records and source instructions

## Context

See [proposal.md](proposal.md) for scope and motivation. Before this assignment,
the repository contained the user's two supplied TailAdmin archives and Git
metadata, with no frontend application or OpenSpec records.

The assigned work is local OpenSpec setup and preservation of definitions already
discussed with the user, including an agent entry point. No GitHub issue was
assigned for this conversation, and none is created by this change. The sibling
repos' issue procedures, role registries and container setups are not imported
as new decisions for this repository.

## Goals / Non-Goals

**Goals:** preserve the approved definitions with identifiable conversation
sources; expose unresolved choices; provide native OpenSpec artifacts and a thin
agent entry point.

**Non-goals:** application code, extraction or modification of the supplied
archives, a complete governance system, unapproved branding, framework selection,
frontend architecture, hosting, publication, archive or Git commits.

## Source instructions

All references below identify the human user's instructions in this repository's
setup conversation on **2026-11-11**. No permanent conversation URLs or GitHub
approval comments were supplied; none are invented. These excerpts identify the
actual instructions and their limits, rather than treating an agent's summary
as approval. The complete six-value meaning is preserved in [product-values](specs/product-values/spec.md).

### U1 — Repository assignment and initial boundaries

The user assigned this repository as the frontend home for the backoffice and
landing page: "these are two different products deployed differently under
different subdomains". The user permitted writes and commands in
`/Users/daniel/Projects/personal/the_unnamed_3`, "but never to commit", and allowed
read-only access in `the_unnamed_1` and `the_unnamed_2`.

The user stated: "Nothing is already defined about the product branding yet"
and "Do not assume anything, ask me if you have any question, dont make decisions
on your own." They asked the agent to stop after the initial understanding work
and recommend next steps. Subsequent instructions authorize only their named
additional scope.

### U2 — TailAdmin and the first four core values

The user stated: "I bought a full license for TailAdmin, so we must start
building/designing from it, mainly for the backoffice. The landing page can use
a from scratch design/code."

The four core values were supplied directly:

1. "Simple, adaptable but powerful and very configurable and felxible by design"
2. "Exact, honest, stable" with the clarification that the implementation tries
   to return "the honest current status, no guesses, no rounding, no
   interpretations ever".
3. "Modularity and scalabiity, you use what you need, pay only for what you need,
   if you decide to grow the other modules are there waiting for you."
4. "We aim to be side by side in the customer journey, making the digitalization
   and modernization process as smoth and familiar as possible."

The user invited deductions as proposals to ask about, not as automatic additions.
The spelling in these source excerpts is preserved; requirements use normalized
spelling without changing the intended meaning.

### U3 — Approval of the two proposed values and setup initiation

The agent proposed two additional values: **customer autonomy and consent**
(customer control over adoption, existing tools and commercial commitments) and
**traceability and accountability** (relevant reasons and committed business
changes that help explain supported results). The user replied:

> I like these two, add them.

The user also directed:

> Another definition, we are going to user openspec like the other repos to
> define everything, so you can start installing it and registering all these
> deinifions there so they dont get lost. Also, you can already start creating
> the AGENTS.md file for future agents

This explicitly approves the additional values and initiates local OpenSpec setup,
recording the existing definitions and creating `AGENTS.md`. It does not approve
unseen implementation or branding choices, importing every sibling-repo process,
or acceptance of the resulting written artifacts.

### U4 — Merchant teams are the only backoffice audience

The user initiated continued discovery with "Good, lets continue with next steps
as proposed". In response to the audience choices of merchant teams, internal
platform staff or both, the user selected:

> 1. Only merchant teams

This defines the backoffice audience as merchant owners, managers and employees,
and excludes an internal platform operator backoffice from this product's scope.
It does not select merchant role templates, permissions, initial customer
segments or the landing page's audience. Recording this answer continues the
user-authorized OpenSpec definition work; it does not initiate application work.

### U5 — Retain the market sector and account for differing technology needs

Asked which merchant segment should guide initial design and messaging, with
greengrocers and small neighbourhood shops identified as the existing working
target, the user replied:

> Yes, retain that market sector for now. Note that we can find people that
> struggle a lot with technology but others that like a very customizable system.

This retains that sector as the current focus and makes both needs explicit in
the intended audience. "For now" keeps the focus provisional. The instruction
does not establish completed market research, select geography or languages, or
approve a concrete interface mechanism for serving those different users.

### U6 — Spain and the initial language choices

Asked which country or region to target first, the user answered:

> Spain only. Languagues: Spanish (main, default), English, Catalán, any other your recommend?

This selects Spain as the sole initial market and Spanish as the main/default
language, alongside English and Catalan. The request for recommendations does
not approve additional languages. It does not select translation tooling,
preference persistence, automatic language detection or changes to shared
identity pages and transactional emails in the second repository.

### U7 — Add Galician and Basque to the initial language scope

In response to the recommendation and the question asking whether Galician and
Basque should also be included in the initial language scope, the user replied:

> yes, add these two also

Both languages are now approved alongside Spanish, English and Catalan. Spanish
remains the main and default language; Spain remains the sole initial market.
This changes the language list, without selecting localization mechanisms or
authorizing writes to the sibling repositories.

### U8 — Approve the personality and investigate two naming candidates

The agent recommended a "warm, approachable and quietly confident" personality,
using "precise, straightforward language". The user replied "I like your idea."
They then proposed "Irin (pronounced Írin)" or "Ilé Irin", requested research
about their meaning and what they transmit, and specified:

> Note that the customers must not relate the name to "Santería", because can be seen as bad.

This approves the stated personality and initiates naming research. The names
are candidates, not a final selection. The quoted concern is the user's
association brief, not a factual judgment about the religion or evidence of
actual customer perceptions.

### U9 — Clarify the intended cultural meaning

Asked what meaning they had heard or intended, the user supplied:

> Irin -> Hierro: Representa la manifestación física del Orisha Ogún, espíritu
> del hierro, la guerra y el trabajo duro. Se asocia con la fuerza y la naturaleza.
> ilé -> (también llamado ilé-osha o casa de santo)

This identifies iron, rather than a different tonal Yoruba word, as the intended
inspiration. It is user-provided context for research, not proof of etymology or
customer reactions. It does not approve a final name, public story or visual motif.

### U10 — Clarify secular positioning and permission to explain the origin

Asked whether the concern was an obvious religious impression or any discoverable
religious connection, the user clarified:

> no really, at some point could be beneficial to explain what it means without
> saying that we defend any religion, it is a cummon practice to user good names
> and other religions words. What Im saying is that we should not add religion
> to our slogan, dfinition, etc. Makes sense?

The brand and product positioning are secular. An accurate explanation of the
name's origin is permitted when relevant, without implying religious endorsement.
A discoverable cultural or religious connection is not itself disqualifying.
This clarifies U8 and replaces its earlier broad interpretation as a requirement
that no customer ever associate the name with religion. It does not select a
final name or approve specific origin-story copy.

### U11 — Center the different modernization experience

When discussing how to position the product, the user clarified:

> I was more thinking on the way we provide a different experience, there are
> already modular SaaS like this oout there, but they are complex, and may not
> be focused on helping anyone modernize and digitalize

The intended differentiation centers on the experience of helping merchants
modernize and digitalize, with simplicity and support already expressed in U2
and differing technology needs in U5. Modularity alone is not the defining
difference. The competitive-complexity observation is the user's assessment,
not an independently verified market finding or approved public superiority
claim. The instruction does not select a human-service model, product-guidance
mechanism, migration package or specific slogan.

### U12 — Combine human and product assistance; retain a future AI idea

Asked whether help should mean in-product guidance, human onboarding/migration
assistance or both, the user replied:

> A combination of both, I was even thinking that a future feature caould be to
> add AI to the frontend interface to help them with thinks like finding
> configurations, explaining them, maybe even help configure the business, etc.

This selects a combined support direction. Specific human-service channels,
availability, proactive onboarding, pricing and deliverables are not defined.
The frontend AI assistant is a future feature idea: possible uses include finding
settings, explaining them and potentially assisting business configuration. It
is not an initiated implementation, approved launch commitment or decision about
whether an AI may change settings. No provider, model or interaction pattern is
selected.

### U13 — Human assistance is on request

Asked whether every new merchant should be offered personal onboarding or human
assistance should be available on request, the user answered:

> On request better

Human onboarding/migration assistance is therefore on merchant request. The
combined product-guidance/human-assistance direction remains in place. Channels,
availability, pricing and detailed service deliverables are still undefined.

### U14 — Irin is the stronger candidate for now

Asked which name should be developed further, the user said:

> Lets assume Irin as the stringer candidate for now

In context, this selects Irin as the stronger/leading candidate provisionally.
It does not finalize the name, establish availability, authorize registration or
select a visual identity. The original Ilé Irin research remains preserved.

### U15 — Interface and brand references

Asked for brands, websites or apps whose appearance they like or wish to avoid,
the user provided:

> - I prefer AWS console over Azure or Google.
> - I dont like the names or branch concept like Naturgy, Lowi, they juts dont transmit trust

The first statement is an interface preference. The second supplies negative
naming/brand-concept references and the user's trust impression. Neither explains
which particular navigation, density, visual, verbal or naming traits create
that preference. No claim about the companies' actual trustworthiness is made,
and no AWS library, visual detail or interface complexity is adopted.

### U16 — Expert reference and extreme beginner simplicity

The user clarified the scope of their AWS preference:

> That is my personal preference, Im a high skilled technical person, so that
> is the clear example of what a high skilled person will try to find in our
> product. In the other hand, we need to make it dead simple for people that
> barely know hoe to open an app. Which means we will probably have to create
> mutlitier UI, adaptable.

This establishes the intended spectrum and the need for extreme simplicity at
the beginner end while preserving depth for expert users. AWS Console is the
user's expert-end reference, not a default experience for all merchants or an
empirical finding about every expert. The proposed multi-tier/adaptable approach
remains under consideration: "probably" does not choose a tier count, specific
views, role mapping, automatic adaptation or selection mechanism.

### U17 — User chooses complexity; simple is the default

Asked whether interface depth should be user-chosen or adapt automatically, the
user answered:

> User choose, simple by default, complex on request

This selects a simple default and explicit user control over greater complexity.
Observed usage alone must not automatically change interface depth. It does not
select the number or names of tiers, a global versus task-specific control,
preference persistence or a suggestion mechanism. Earlier three-level examples
remain proposals rather than approved modes.

## Setup approach

### D1 — Use the existing native OpenSpec tool

The host already has OpenSpec **1.14.3**, confirmed with
`OPENSPEC_TELEMETRY=0 openspec --version`. No package installation or shared-tool
upgrade was needed. Initialization used `openspec init --tools none
--no-copilot-cloud --no-animation`, preserving the other repos' use of the native
`spec-driven` schema without generated provider integrations. The CLI reported
that the Copilot-cloud flag was ignored because that tool was not selected.

The installed version's help and artifact instructions were inspected. The
[official CLI reference](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md)
and [concepts](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)
were consulted on 2026-11-11; current upstream documentation is not a claim that
every described command is present in the installed version.

### D2 — Keep a native unarchived foundation change

The change has a proposal, three capability deltas, this source/design record and
one detailed task checklist. `AGENTS.md` and configuration point to those records.
Native change artifacts retain the distinction between recorded source decisions
and installed canonical specifications. No canonical publication or archive is
performed in this assignment.

### D3 — Preserve the scope of the values

The six values constrain future proposals. They do not by themselves add backend
APIs, determine numeric presentation, implement a support service, set prices,
certify runtime stability or guarantee capacity. Relevant history remains subject
to the owning module's access and availability rules. Defining a principle does
not mean its full product behavior exists today.

### D4 — Preserve the merchant-team audience boundary

SCOPE-005 records U4. The second repo's existing
[deferral of a custom operator back-office](../../../../the_unnamed_2/openspec/specs/merchant-access/spec.md#requirement-mer-012--custom-operator-back-office-deferred)
remains intact. No internal operator UI or new authorization model follows from
the merchant-team audience decision.

### D5 — Preserve the current sector and both kinds of user needs

SCOPE-006 and SCOPE-007 record U5 alongside VAL-001's simplicity and flexibility.
The target includes both people who need an approachable experience and people
who want extensive configuration. No separate beginner/advanced products,
automatic adaptation, permission model or configuration layout is selected.

### D6 — Preserve the five approved languages and recommendation history

SCOPE-008 and SCOPE-009 record U6 and U7. The frontend records can be updated within
this repository; the second repo remains read-only and its Spanish/English identity
and onboarding requirements are not changed here. The customer journey's precise
cross-repository translation coverage still needs to be agreed.

**Recommendation history, subsequently approved by U7:** Galician and Basque were
recommended as the next candidates, with priority informed by the first merchants'
regions and language preferences. Their regional relevance was supported by the
[IGE household language-use results for 2023](https://www.ige.gal/igebdt/principais.jsp?C=T%5B2%3A0%5D%3B0%5Ball%5D&COD=3006&F=1%3A0&R=3%5Ball%5D&S=&idioma=es)
and the [Basque Government's 2021 sociolinguistic survey](https://www.euskadi.eus/contenidos/informacion/eas_ikerketak/es_def/adjuntos/VII-ENCUESTA-SOCIOLINGUISTICA_resumen-.pdf),
consulted on 2026-11-11. That recommendation was inferred from regional language
use and the familiar-modernization value; the surveys are not evidence of demand
among this product's prospective customers. U7, rather than the recommendation
alone, approves both languages for the initial scope.

### D7 — Record the approved personality while names remain candidates

SCOPE-010 preserves the accepted personality and language direction. SCOPE-011
preserves the secular-positioning brief as clarified by U10, including permission
to explain the origin accurately without religious endorsement. U14 identifies
Irin as the leading candidate for now, recorded in SCOPE-014. Neither candidate
is adopted as a final product name, and the research assessment below does not
establish an approved visual identity or measured audience reaction.

### D8 — Preserve the experience emphasis without inventing a service

SCOPE-012 records U11 alongside VAL-001, VAL-004 and SCOPE-007. The lead
positioning concerns the merchant's experience of modernization and digitalization;
modularity and configuration depth support it. U12 selects a combination of
in-product guidance and human onboarding/migration assistance, recorded in
SCOPE-013. U13 specifies that human assistance is on merchant request. Staffing,
support availability, specific assisted-import/migration
deliverables and measurable customer-outcome promises remain undefined.

### D9 — Preserve the future AI idea without adopting its behavior

The U12 AI idea is retained as a candidate future feature. It could support the
existing modernization-assistance direction by locating configuration and
explaining it, with business-setup assistance also under consideration. Detailed
behavior, timing and any authority to change business settings remain open.
Existing exactness, honest-status and customer-control values continue to apply;
no additional AI mechanism or permission rule is selected here.

### D10 — Clarify traits before adopting a design reference

SCOPE-015 records U15 as clarified by U16. AWS Console is this user's positive
expert-interface reference; Naturgy and Lowi are negative naming/brand references
for this user. Their roles are kept
distinct. The user's preferred/disliked traits still need clarification before
turning these references into palette, typography, layout, navigation, naming or
voice decisions. The TailAdmin foundation and approved warm, approachable,
quietly confident personality remain applicable.

### D11 — Preserve the user spectrum and explore adaptable presentation

SCOPE-007 reflects U16's beginner-to-expert spectrum. Extremely simple everyday
work and deep configuration must be considered together. U17 and SCOPE-016
select default simplicity and user-controlled complexity. Tier count, specific
controls, boundaries and preference behavior remain open; no fixed three-mode
architecture is adopted.

**Further exploration recommendation only:** investigate progressive disclosure
within a consistent interface to deliver U17's user-controlled depth. The
[W3C familiar-interface personalization guidance](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o8p04-interface/)
supports user personalization, while its
[consistent-visual-design guidance](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p03-consistent-design/)
supports familiar, consistent controls and navigation. Consulted 2026-11-11.
These are supplemental design references, not evidence that a specific tier
design works for this product or approval of one. They do not equate limited
technology experience with a disability. Existing exact-value and honest-status
requirements remain applicable to any presentation depth.

## Naming research — findings and preliminary assessment

Research date: **2026-11-11**. Scope: meanings, intended cultural context,
pronunciation and likely brand readings of the two candidates. No customer
interviews, linguistic consultation, trademark clearance, domain-availability
check or registration was performed.

### Sourced findings

| Source                                                                                                                             | Supported finding                                                                                                                         | Limit                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [University of Texas, Yorùbá Yé Mi appendix](https://coerll.utexas.edu/yemi/pdfs/yy_z-appendix.pdf), printed p. 310                | Modern Yoruba `irin` means iron/metal; differently toned `ìrìn` means walk.                                                               | These are distinct words. Spanish first-syllable stress is not a substitute for Yoruba tone, and modern Yoruba alone does not establish every Cuban Lucumí usage.       |
| [University of Texas, Yorùbá Yé Mi chapter 10](https://coerll.utexas.edu/yemi/pdfs/yy_ch10.pdf), housing vocabulary and lessons    | `Ilé` is used for house in ordinary domestic contexts.                                                                                    | The word is not exclusive to religion.                                                                                                                                  |
| [University of Michigan Museum of Art, Ax for Ogun](https://umma.umich.edu/objects/ax-for-ogun-2006-2-73/)                         | Ogún is associated with iron and the livelihoods of people using iron tools, with both constructive and conflict-related aspects.         | Strength, reliability and craftsmanship are possible brand interpretations, not the literal translation of `irin`. Nature is not established as its dictionary meaning. |
| [Harvard Pluralism Project, La Regla de Ocha-Ifa and Lukumi](https://pluralism.org/%E2%80%9Csanter%C3%ADa%E2%80%9D-the-lucumi-way) | Ocha communities are organized in ilés, or houses, led by priests or priestesses.                                                         | This supports a recognizable religious use of `ilé`, not a finding that every customer will recognize it.                                                               |
| [Elhuyar Basque–Spanish dictionary, irin](https://hiztegiak.elhuyar.eus/eu_es/irin)                                                | In Basque, `irin` means flour (`harina`).                                                                                                 | This is a relevant independent meaning for a Spain-focused product supporting Basque; customer associations have not been measured.                                     |
| [RAE, Ortografía](https://www.rae.es/diccionario-estudiante/docs/ortografia.pdf), §3.1                                             | Under normal Spanish spelling rules, unaccented `Irin` would be read with first-syllable stress; `Irín` would mark final-syllable stress. | This applies the rules to a proposed brand; final spelling is not chosen and pronunciation across all five languages is untested.                                       |

Combining the supported ordinary meanings suggests **"house of iron"** for
`Ilé Irin`. That is a compositional reading, not a verified fixed religious term
or a native-speaker certification of the complete expression. Exact-phrase
searches did not establish such an attestation. It must not be presented as
"house of Ogún" or an established ceremonial name on the available evidence.

### Brand interpretation — proposals, not audience findings

- **Irin:** its short form is a promising candidate for the intended secular
  product. The iron inspiration can suggest useful tools, dependable work and
  strength. An overly industrial treatment could also suggest rigidity or
  coldness, so it needs evaluation against the approved warm personality.
- **Ilé Irin:** the house idea could suggest belonging and a dependable home for
  business tools. Adding `Ilé` introduces a term with an established Lukumí
  religious-house use. Under U10, that connection is not itself disqualifying;
  the name can be evaluated for its sound, length and fit with a secular business
  identity. Customer recognition and interpretation have not been measured.
- The Basque flour meaning could create a food-related reading for some local
  customers. That may suit neighbourhood food retail, or suggest a food business
  rather than software; actual interpretation needs customer evidence.

**Preliminary recommendation:** retain **Irin** as the stronger candidate for
discussion for its short form and practical iron inspiration. A public origin
explanation may accurately discuss the word and cultural context when relevant,
without implying religious endorsement. Slogans and product definitions remain
secular. U10 resolves the earlier question about discoverability: recognizing the
origin is acceptable. No false etymology or customer-reaction claim is introduced.

Before a final choice, recommended next checks are intended-meaning review by a
competent Yoruba/Lucumí speaker, unprompted association/pronunciation checks with
target merchants across the intended language groups, and name/domain clearance.
These are recommendations, not completed work or authorization to contact people,
buy domains, register marks or adopt the name.

## Open questions for later user decisions

These questions do not prevent recording the definitions already supplied. They
must be answered before work that depends on them; no answer is selected here.

- **Localization details:** Spain and the five initial languages are defined by
  U6 and U7. Translation coverage across frontend products, shared identity pages
  and emails, language
  preference behavior and translation review/maintenance are not yet defined.
- **Modernization assistance details:** U12 selects product guidance plus human
  onboarding/migration assistance, with U13 selecting human help on request.
  Delivery channels, responsibilities, pricing, availability and exact service
  scope remain open.
- **Future AI assistance:** finding/explaining settings and possible business
  configuration assistance are retained ideas. Scope, timing, interaction and
  whether/how settings could be changed remain undecided.
- **Brand identity:** personality and language direction are approved in U8.
  Final name, visual direction, logo, colors, typography and detailed voice
  guidelines remain open. U14 makes Irin the leading candidate for now; the
  earlier Ilé Irin research is retained. No audience perception or availability
  claim is established. U15 supplies interface/brand references, but their
  specific liked/disliked traits remain to be clarified. U16 defines AWS as an
  expert-end reference rather than the beginner baseline.
- **Adaptable UI:** multi-tier presentation is under consideration. Number and
  boundaries of tiers, global versus task-specific controls, preference scope
  and persistence, suggestion behavior and any relationship to business roles
  remain open. U17 selects a simple default and user-controlled complexity;
  automatic depth changes based on usage are not the chosen approach.
- **Frontend architecture:** selected TailAdmin variant/framework, application
  organization, shared code, authentication integration and separate build and
  deployment arrangements. Archive filenames alone decide none of these.
- **Landing-page scope:** audience, message, pages and intended visitor actions;
  no pricing, acquisition or conversion claims are selected.
- **Subdomains and hosting:** actual names, services and environments.
- **Repository workflow beyond this assignment:** whether and how to adopt
  GitHub assignments, roles, independent review and additional agent tooling.

## Risks / Trade-offs

- Source decisions can be mistaken for an accepted transcription: status notes
  separate those states, and the source excerpts remain available for comparison.
- Broad product values can be mistaken for implemented features: no application
  code or runtime claim is included, and future work needs its own defined scope.
- Reading another repo can be mistaken for permission to modify or adopt its
  entire contents: the sibling repos remain read-only supporting sources with
  their own authority and limitations.

## Decision evidence

This is a self-verified local documentation handoff. Independent review and user
acceptance have not been performed; neither is implied by the checks below.

| Implemented decision                                                                                                                                                                              | Approved source and approval reference       | Implementation location                                                                  | Verification and result                                                                                                                                                | Conformance                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Preserve six core values                                                                                                                                                                          | U2; U3 explicitly approves the two additions | `specs/product-values/spec.md`                                                           | Compared VAL-001–006 and scenarios to U2/U3; native strict validation passed                                                                                           | Consistent on author self-check |
| Preserve two products, separate deployments/subdomains, merchant-team-only backoffice, current sector and technology needs, Spain/five initial languages, and TailAdmin/custom-landing boundaries | U1, U2 and U4–U7                             | `specs/frontend-scope/spec.md`; `openspec/config.yaml`                                   | Compared SCOPE-001–009 and open questions to the source instructions; validation results below                                                                         | Consistent on author self-check |
| Preserve approved personality and secular positioning with permitted origin explanation; research candidates without adopting a name                                                              | U8–U10                                       | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; naming research in this document | Compared SCOPE-010–011 to the user's instructions and U10 clarification; source/interpretation limits stated; validation results below                                 | Consistent on author self-check |
| Center intended differentiation on the modernization experience without inventing services or verified competitor claims                                                                          | U11, with U2/U5                              | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; this document                    | Compared SCOPE-012 to the user's clarification; detailed service scope remains open; validation results below                                                          | Consistent on author self-check |
| Combine product guidance and human assistance on request while retaining AI as a future candidate                                                                                                 | U12 and U13                                  | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; this document                    | Compared SCOPE-013 and future-idea status to U12/U13; remaining service details and AI authority stay open; validation results below                                   | Consistent on author self-check |
| Record Irin as the leading candidate provisionally                                                                                                                                                | U14                                          | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; this document                    | Compared SCOPE-014 to the user's instruction; final identity and availability remain open; validation results below                                                    | Consistent on author self-check |
| Preserve personal interface and brand references without selecting traits                                                                                                                         | U15 and U16                                  | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; this document                    | Compared SCOPE-015 to the user's statements and expert-reference clarification; trait-level preferences remain open; validation results below                          | Consistent on author self-check |
| Preserve extreme beginner simplicity and expert depth while keeping unspecified tier details open                                                                                                 | U16/U17, with U2/U5                          | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; this document                    | Compared SCOPE-007 to the user spectrum and selected depth principle; no tier count or concrete controls adopted; validation results below                             | Consistent on author self-check |
| Make the interface simple by default with complexity on user request                                                                                                                              | U17                                          | `specs/frontend-scope/spec.md`; `openspec/config.yaml`; this document                    | Compared SCOPE-016 to U17; specific mechanisms and persistence remain open; validation results below                                                                   | Consistent on author self-check |
| Record authority, access limits and no commits; create an agent reading entry point                                                                                                               | U1 and U3                                    | `specs/specification-workflow/spec.md`; root `AGENTS.md`                                 | Entry-point targets and source links resolve; repository inventory contains only authorized additions and existing archives; no staged changes, refs or reflog entries | Consistent on author self-check |
| Initialize OpenSpec and record definitions without choosing new product behavior                                                                                                                  | U3                                           | `openspec/config.yaml`; native change artifacts and initialization placeholders          | CLI initialization succeeded; all four artifact instructions load project context and rules; strict validation passed                                                  | Consistent on author self-check |

## Verification results — 2026-11-11

- `OPENSPEC_TELEMETRY=0 openspec validate --all --strict --json --no-interactive`:
  **1 change passed, 0 failed, no issues**. There are no installed canonical specs.
- `openspec status --change establish-frontend-foundation --json`: all four native
  planning artifacts are present. The CLI's planning-complete status is not user
  acceptance or a runtime result.
- `openspec instructions <artifact> --change establish-frontend-foundation --json`:
  project context and artifact rules load for proposal, specs, design and tasks.
- Local document check: **7 Markdown files, 18 local links and anchors, 3 declared
  capability files and 16 unique requirement IDs; no errors or trailing whitespace**.
- Scoped inventory: `AGENTS.md` and OpenSpec files are the only additions beyond
  the original archives. Git index is empty; no refs or reflog entries exist.
- Archive preservation: the two ZIPs retain their original sizes (324,850,588 and
  9,048,744 bytes) and observed modification times. No extraction or archive writes
  were performed. The sibling repositories were only read.
- **Document/tool verification:** PASS for the checks above. **Decision
  conformance:** consistent on author self-check against U1–U3; no independent
  verdict is claimed. No runtime tests apply to this documentation-only setup.

Audience decision follow-up after U4: native strict validation again passed
**1 change, 0 failures, no issues**. The document check passed for **7 Markdown
files, 18 local links and 17 unique requirements**. OpenSpec's specs instructions
load the merchant-only backoffice boundary from configuration, and the resolved
audience is no longer listed as an open question. The Git index remains empty
with zero reachable commits. The U4 transcription and SCOPE-005 are consistent
on author self-check; no workflow, permission or internal operator UI was added.

Sector and user-needs follow-up after U5: native strict validation passed
**1 change, 0 failures, no issues**. Document checks passed for **7 Markdown
files, 18 local links and 19 unique requirements**. OpenSpec's specs instructions
load the current sector and both technology-comfort/customization needs from
configuration. The index remains empty with zero reachable commits. U5 and
SCOPE-006–007 are consistent on author self-check; geography, languages and
specific interface mechanisms remain undecided.

Market and language follow-up after U6: native strict validation passed
**1 change, 0 failures, no issues**. Document checks passed for **7 Markdown
files, 18 local links and 21 unique requirements**. OpenSpec's specs instructions
load Spain-only targeting and Spanish (main/default), English and Catalan from
configuration. The index remains empty with zero reachable commits. U6 and
SCOPE-008–009 are consistent on author self-check; Galician and Basque remain
recommendations, and no sibling-repository translation requirements were changed.

Language approval follow-up after U7: native strict validation passed
**1 change, 0 failures, no issues**. Checks passed for **7 Markdown files,
18 local links and 21 unique requirements**. SCOPE-009 and the loaded OpenSpec
context include Spanish (main/default), English, Catalan, Galician and Basque.
The index is empty with zero reachable commits. The U7 record and updated
language list are consistent on author self-check.

Personality and naming-research follow-up after U8/U9: native strict validation
passed **1 change, 0 failures, no issues**. Checks passed for **7 Markdown files,
18 local links and 23 unique requirements**. OpenSpec's specs instructions load
the approved personality and candidate-only naming status. The index is empty
with zero reachable commits. SCOPE-010–011 and the source record are consistent
on author self-check. Linguistic sources were checked as described above; no
native-speaker review, customer-association test or availability check is claimed.

U10 clarification: strict validation passed **1 change, 0 failures, no issues**;
local checks passed **7 Markdown files, 18 local links and 23 unique requirements**.
Configuration instructions load secular positioning, permission for an accurate
origin explanation and acceptance of a discoverable connection. SCOPE-011 is
consistent with U10 on author self-check. The name remains undecided; the index
is empty with zero reachable commits.

U11 positioning clarification: strict validation passed **1 change, 0 failures,
no issues**; local checks passed **7 Markdown files, 18 local links and 24 unique
requirements**. Configuration instructions load the modernization-experience
emphasis and the still-open assistance model. SCOPE-012 is consistent with U11
on author self-check. The index remains empty with zero reachable commits.

U12 assistance direction: strict validation passed **1 change, 0 failures, no
issues**; local checks passed **7 Markdown files, 18 local links and 25 unique
requirements**. Configuration instructions distinguish combined product/human
support from the future AI candidate. SCOPE-013 and the U12 transcription are
consistent on author self-check; detailed service commitments and AI action
authority remain open. The index is empty with zero reachable commits.

U13 on-request assistance: strict validation passed **1 change, 0 failures, no
issues**; local checks passed **7 Markdown files, 18 local links and 25 unique
requirements**. Configuration instructions load the on-request human-assistance
model. SCOPE-013 is consistent with U13 on author self-check; other service terms
remain open. The index is empty with zero reachable commits.

U14 provisional naming preference: strict validation passed **1 change, 0 failures**;
local checks passed **7 Markdown files, 18 local links and 26 unique requirements**.
Configuration instructions identify Irin as the leading candidate for now while
preserving the open final name and visual identity. SCOPE-014 is consistent with
U14 on author self-check. The index is empty with zero reachable commits.

U15 design references: strict validation passed **1 change, 0 failures**; local
checks passed **7 Markdown files, 18 local links and 27 unique requirements**.
Configuration instructions preserve the personal interface/brand preferences
and their clarification limits. SCOPE-015 is consistent with U15 on author
self-check. The index is empty with zero reachable commits.

U16 skill-spectrum clarification: strict validation passed **1 change, 0 failures**;
local checks passed **7 Markdown files, 18 local links and 27 unique requirements**.
Configuration instructions preserve extreme beginner simplicity, expert depth,
the expert-only scope of the AWS reference and unresolved adaptation mechanisms.
SCOPE-007/SCOPE-015 are consistent with U16 on author self-check. No specific UI
tiers or adaptation behavior were adopted. The index is empty with zero reachable
commits.

U17 interface-depth decision: strict validation passed **1 change, 0 failures**;
local checks passed **7 Markdown files, 18 local links and 28 unique requirements**.
Configuration instructions load the simple default and user-requested complexity
without automatic usage-based depth changes. SCOPE-007/SCOPE-016 are consistent
with U17 on author self-check; tier count, controls, preference scope and
persistence remain open. The index is empty with zero reachable commits.
