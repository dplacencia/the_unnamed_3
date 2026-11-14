# Selected TanStack foundation — 2026-11-13

The user accepted the qualification recommendation:

> I agree, lets set TanStack. Continue with the design based on that. Make sure
> you use the latest available pinned version

PT-018 records TanStack Table for Products, with retained TailAdmin controls and
styling. This supersedes the pre-adoption status in the historical qualification
report. It does not select other TanStack ecosystem packages or replace the
approved React state/Context and React Hook Form/Zod decisions.

## Version verification and dependency scope

Public npm metadata was checked at **2026-11-13 16:18 UTC**:

| Package                   | Registry latest stable | Published               | Scope                                                                    |
| ------------------------- | ---------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `@tanstack/react-table`   | `9.3.1`                | 2026-10-12 16:50:44 UTC | Selected runtime dependency, exact pin                                   |
| `@tanstack/react-virtual` | `3.14.26`              | 2026-11-03 15:39:43 UTC | Existing evaluation dependency; use when a workload needs virtualization |

Sources: [React Table registry metadata](https://registry.npmjs.org/@tanstack%2freact-table),
[React Virtual registry metadata](https://registry.npmjs.org/@tanstack%2freact-virtual).
Both meet the existing 1440-minute release waiting period. Table 9.3.1 is the
same release exercised in the qualification; no version upgrade was necessary.
The manifest and pnpm lock move its exact pin from dev to runtime dependencies.
No caret/tilde, release-age exception or install-script approval was introduced.
Tabulator remains isolated as a development-only comparison reference.

The published Table integrity is
`sha512-E6Ya5TnY6EaGyZYIUqig/29Lr/gJSAubQkLJFqiWkUl5nRCr0Xr9hvJot+NiRTtG+TzGxHTiqUW3bnLtQxlHug==`.
Its direct Table Core is 9.3.1; lockfile resolutions remain unchanged. Package
agent skills remain unapproved. An engine selection does not approve them.

## Subsequent expansion selections

The user chose **“Compact expansion + full details panel (Recommended)”**.
PT-019 adds requested read-only summaries beneath product rows while retaining
PT-014's desktop side panel and full-phone panel for inspection and PT-017's
explicit editing paths. It does not introduce child products or replace the panel.

The user then chose **“Identifiers/status + hidden catalogue fields (Recommended)”**.
PT-020 selects barcode(s), active/archived status, catalogue fields hidden through
Vista and an Abrir detalles action. Only already-selected catalogue fields are
implied by hidden fields; this creates no arbitrary metadata. Barcode presentation
preserves supported associations and exact characters. It does not infer that
every product has one barcode or add package-management capabilities. Stock
retains its selected visibility/location and exactness rules.

Finally, the user chose **“Several summaries can stay open (Recommended)”**.
PT-021 selects rows initially collapsed, opened explicitly and independently.
Expansion retention during search/navigation, draft lifetime and exact dimensions
remain separate. The first browsing design follows the bounded
[prototype plan](prototype-plan.md); final field/editing/save decisions and image
approval do not follow from the library or expansion choices.
