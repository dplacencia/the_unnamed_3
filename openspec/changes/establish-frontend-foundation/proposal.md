# Establish the frontend product foundation

## Why

The new frontend repository needs a durable record of the user's product values,
two-product scope and TailAdmin requirement before design or application work
begins. OpenSpec and an agent entry point will preserve these decisions without
filling unresolved branding or technical choices with assumptions.

## What Changes

- Initialize the native OpenSpec `spec-driven` structure with the installed CLI.
- Record all six agreed core values and the user's explicit approval of the two
  additional values: customer autonomy and traceability.
- Record separately deployed backoffice and landing-page products, TailAdmin as
  the backoffice foundation, its merchant-team-only audience and permission for
  a custom landing page.
- Record greengrocers and small neighbourhood shops as the current design and
  messaging focus, including users who can barely open an app and highly skilled
  technical users needing extensive customization. Record a simple default with
  user-selected complexity; tier count and specific UI mechanisms remain open.
- Record Spain as the sole initial market, with Spanish as the main/default
  frontend language and English, Catalan, Galician and Basque also included.
- Record the approved warm, approachable, quietly confident personality and
  precise, straightforward language; research Irin and Ilé Irin as candidates
  with secular brand positioning and permission to explain the name's origin
  accurately when relevant, without religious endorsement.
- Record Irin as the leading naming candidate for now, preserving its provisional
  status and the open final identity and availability questions.
- Preserve the user's AWS Console preference as an expert-user reference and
  negative Naturgy/Lowi naming and brand references, without inventing specific
  preferred/disliked traits or adopting AWS as the beginner baseline.
- Record the current authority and repository boundaries, including no commits.
- Record the user's emphasis on a different modernization/digitalization
  experience, with modularity supporting that experience and a combination of
  in-product guidance and human onboarding/migration assistance on request.
- Preserve a possible future frontend AI assistant for locating/explaining
  settings and possibly helping configure the business, without adding it to
  current implementation scope or selecting its action authority.
- Create root `AGENTS.md` as a reading entry point to these OpenSpec records.
- Preserve open questions and the actual user instructions in [design.md](design.md).

## Capabilities

### New Capabilities

- `product-values`: the six values guiding product experience and brand decisions.
- `frontend-scope`: product separation, merchant-team backoffice audience, current
  market and language scope, differing technology needs, design foundations and
  brand personality, experience-led positioning, naming evaluation and unresolved
  identity choices.
- `specification-workflow`: OpenSpec documentation, agent context and the user's
  authority and repository boundaries.

### Modified Capabilities

None; this repository had no existing OpenSpec capabilities.

## Impact

Documentation and OpenSpec configuration only. The permitted new/changed files
are root `AGENTS.md`, `openspec/config.yaml` and this change's native artifacts,
plus the native empty-directory placeholders created by initialization.
The supplied TailAdmin ZIPs remain untouched. No application dependencies,
framework, deployment service, subdomain name, backend contract or sibling-repo
file changes are included. No commit, publication or archive is included.

## Authority and status

The user explicitly authorized setup and recording the existing definitions on
2026-11-11. [The instruction record](design.md#source-instructions) identifies
each source and its scope. The underlying six values and stated constraints are
user-approved; this structured wording is newly recorded for review. Recording
them does not claim acceptance of this deliverable, independent review or runtime
implementation. The change remains unarchived and no canonical specs are installed.

## Supporting product context

The first repo's [product thesis](../../../../the_unnamed_1/project_idea.md)
describes incremental modernization through independently useful retail modules.
The second repo's [Inventory journey](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md)
describes its defined customer-facing scope. These are read-only context, with
their own approval and implementation limits. This change does not reapprove the
whole thesis, migrate their specifications or establish completed functionality.
