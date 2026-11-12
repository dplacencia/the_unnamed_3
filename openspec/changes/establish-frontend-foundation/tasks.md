# Foundation setup tasks

Scope: U1–U17 in [design.md](design.md#source-instructions). These tasks cover
documentation setup only. Checked tasks record completed work and specified
checks, not user acceptance, independent review, application implementation or
authorization to publish/archive.

## 1. Initialize and record definitions

- [x] 1.1 Initialize native OpenSpec metadata, `openspec/config.yaml`, `openspec/specs/.gitkeep`, `openspec/changes/archive/.gitkeep` and this change's `.openspec.yaml`; verify successful CLI initialization and the existing installed version. Supports WORK-001 and U3.
- [x] 1.2 Record U1–U3, scope, status and unresolved choices in `proposal.md` and `design.md`; verify by comparison with the user's conversation instructions. Supports WORK-002 and WORK-005.
- [x] 1.3 Write `specs/product-values/spec.md`; verify all six values and the explicit U3 approval of the two additions are preserved. Supports VAL-001–006.
- [x] 1.4 Write `specs/frontend-scope/spec.md`; verify separate products/deployments/subdomains, TailAdmin foundation, custom landing permission and unresolved branding. Supports SCOPE-001–004.
- [x] 1.5 Write `specs/specification-workflow/spec.md` and root `AGENTS.md`; verify the entry point links to the complete records and preserves authority, read-only siblings and no commits. Supports WORK-001–006.

## 2. Verify and report

- [x] 2.1 Run native strict validation for all repository OpenSpec items, including this change; inspect artifact status and configuration-derived instructions. Record actual results in `design.md`. Supports WORK-001 and WORK-006.
- [x] 2.2 Verify local Markdown links, declared capabilities, the permitted file inventory, the archives' original sizes/observed modification times and the empty Git index/history; self-check meaning against U1–U3 and record results and open questions without proceeding to app work. Supports SCOPE-001–004 and WORK-002–006.

## 3. Record the backoffice audience decision

- [x] 3.1 Record U4 and SCOPE-005 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`, and remove the resolved audience question; verify merchant teams are the only backoffice audience without selecting workflows or permissions.
- [x] 3.2 Re-run native strict validation, local-link and requirement checks, and verify configuration instructions carry the merchant-only audience. Record the results in `design.md`. Supports SCOPE-005 and WORK-002–006.

## 4. Record the current sector and differing technology needs

- [x] 4.1 Record U5 and SCOPE-006–007 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`, and narrow the remaining market question to geography/languages; verify the sector stays provisional and both user needs are preserved without selecting interface mechanisms.
- [x] 4.2 Run native strict validation, check local links and requirement IDs, and confirm configuration instructions load the sector and both user needs; record results in `design.md`. Supports SCOPE-006–007 and WORK-002–006.

## 5. Record Spain and the initial languages

- [x] 5.1 Record U6 and SCOPE-008–009 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`, and distinguish additional-language proposals from the approved list; verify Spain-only targeting and Spanish as main/default alongside English and Catalan.
- [x] 5.2 Run native strict validation, check local links and requirement IDs, and verify configuration instructions load the selected market/languages; record results in `design.md`. Supports SCOPE-008–009 and WORK-002–006.

## 6. Add the approved Galician and Basque languages

- [x] 6.1 Record U7 and update SCOPE-009, `design.md`, `proposal.md` and `openspec/config.yaml`; verify all five languages are included, Spanish remains main/default and the recommendation's status now records user approval.
- [x] 6.2 Run native strict validation, check links and requirement IDs, and confirm configuration instructions carry the five-language list; record results in `design.md`. Supports SCOPE-009 and WORK-002–006.

## 7. Record personality and research naming candidates

- [x] 7.1 Record U8/U9, SCOPE-010–011 and the accepted personality in `design.md`, `specs/frontend-scope/spec.md`, `proposal.md` and `openspec/config.yaml`; verify the name remains undecided and the religious-association brief is preserved.
- [x] 7.2 Research the two names and record sources, meanings, Spanish pronunciation, the Basque meaning and preliminary brand readings in `design.md`; verify that sourced facts, compositional translation, user context, recommendations and missing customer/availability evidence are distinguished. Supports SCOPE-011 and VAL-002.
- [x] 7.3 Run native strict validation, check links/anchors and requirement IDs, and verify the configuration carries the approved personality and candidate-only naming status; record results in `design.md`. Supports SCOPE-010–011 and WORK-002–006.

## 8. Clarify secular positioning and origin explanations

- [x] 8.1 Record U10 and update SCOPE-011, `design.md`, `proposal.md` and `openspec/config.yaml`; verify slogans and product definitions remain secular, truthful origin explanations are permitted, and discoverable connections are not disqualifying. Preserve the undecided name status.
- [x] 8.2 Run native strict validation, check local links and requirement IDs, and confirm configuration instructions carry the clarified scope; record results in `design.md`. Supports SCOPE-011 and WORK-002–006.

## 9. Record the modernization-experience positioning

- [x] 9.1 Record U11 and SCOPE-012 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`; verify the experience is central, modularity is supporting, and the assistance model and competitor evidence remain undecided/unverified respectively.
- [x] 9.2 Run native strict validation, check links and requirement IDs, and confirm configuration instructions carry the clarified positioning; record results in `design.md`. Supports SCOPE-012 and WORK-002–006.

## 10. Record combined assistance and the future AI idea

- [x] 10.1 Record U12 and SCOPE-013 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`; verify product guidance and human assistance are included while specific service commitments remain open, and AI is recorded only as a future idea without implementation or action authority.
- [x] 10.2 Run native strict validation, check links and requirement IDs, and verify configuration instructions distinguish combined support from the future AI idea; record results in `design.md`. Supports SCOPE-013 and WORK-002–006.

## 11. Record human assistance on request

- [x] 11.1 Record U13 and update SCOPE-013, `design.md`, `proposal.md` and `openspec/config.yaml`; verify human assistance is on merchant request while the combined support direction and unresolved service details are preserved.
- [x] 11.2 Run native strict validation, check links and requirement IDs, and verify configuration instructions carry the on-request model; record results in `design.md`. Supports SCOPE-013 and WORK-002–006.

## 12. Record Irin as the leading candidate

- [x] 12.1 Record U14 and SCOPE-014 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`; verify Irin is the leading candidate for now without asserting a final name, availability, registration or approved visual identity.
- [x] 12.2 Run native strict validation, check links and requirement IDs, and verify configuration instructions carry the provisional leading-candidate status; record results in `design.md`. Supports SCOPE-014 and WORK-002–006.

## 13. Record interface and brand references

- [x] 13.1 Record U15 and SCOPE-015 in `design.md` and `specs/frontend-scope/spec.md`, update `proposal.md` and `openspec/config.yaml`; verify AWS Console is an interface preference and Naturgy/Lowi are negative naming/brand references reflecting the user's trust impression, without selecting unspecified traits or replacing TailAdmin.
- [x] 13.2 Run native strict validation, check links and requirement IDs, and verify configuration instructions preserve the preference/clarification limits; record results in `design.md`. Supports SCOPE-015 and WORK-002–006.

## 14. Clarify the beginner-to-expert spectrum and adaptable UI idea

- [x] 14.1 Record U16 and update SCOPE-007/SCOPE-015, `design.md`, `proposal.md` and `openspec/config.yaml`; verify AWS is an expert-end reference, extremely inexperienced users require extreme simplicity, and a multi-tier UI remains a candidate with count/selection/adaptation behavior open. Preserve supplemental guidance as recommendation, not approval.
- [x] 14.2 Run native strict validation, check links and requirement IDs, and verify configuration instructions preserve the spectrum and unresolved mechanisms; record results in `design.md`. Supports SCOPE-007, SCOPE-015 and WORK-002–006.

## 15. Record simple defaults and user-selected complexity

- [x] 15.1 Record U17 and SCOPE-016, align SCOPE-007, `design.md`, `proposal.md` and `openspec/config.yaml`; verify simplicity is the default and the user chooses greater complexity without automatic usage-based depth changes, while tier count, controls, preference scope and persistence remain open.
- [x] 15.2 Run native strict validation, check links and requirement IDs, and verify configuration instructions carry the selected depth principle; record results in `design.md`. Supports SCOPE-007, SCOPE-016 and WORK-002–006.

## Workflow follow-up

- The user reviews the recorded wording and chooses the next discussion or work.
- Publication/archive, a fuller repository workflow and application work are not
  part of this setup assignment. No commits are permitted.
