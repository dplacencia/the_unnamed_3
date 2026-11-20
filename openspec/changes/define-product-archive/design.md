## Sources

- Core [Inventory onboarding](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md) JNY-013 requires live archiving of an eligible product.
- Native [product identity and lifecycle](../../../../the_unnamed_1/openspec/specs/inventory-product-identity-lifecycle/spec.md) preserves permanent identity and history and ends active assignments on archive.
- Native [local lifecycle contract](../../../../the_unnamed_1/openspec/specs/inventory-product-identity-lifecycle-contract/spec.md) defers general archival and supports explicit archived inclusion on exact authorized reads. The current [browser gateway](../../../../the_unnamed_2/platform/gateway/openapi/openapi.json) has no product archive route.

## Interaction

Reuse the Products table and responsive details sheet. Review the effect on the active list, current identifiers and history before sending one archive request for the exact product. After confirmation, retain the opened product and show it as archived. The existing filters decide whether the product remains in the table. Current identifiers end on archive, so the current SKU and barcode fields are empty in the confirmed fixture. Inventory owns eligibility and assigned identifiers.

The preview isolates archiving from catalogue editing. A live editor requires an agreed guard for unsaved changes and submitted edits whose outcome remains unknown. For an uncertain archive, preserve and label the last recorded product state and withhold a fresh archive action. Recovery depends on the archive command contract and current authority. A refused fixture explicitly supplies confirmation that the product remains active.

## Review

The Storybook stories cover the active product, confirmation, confirmed result, confirmed refusal and uncertain result. All use synthetic data and the shared detail sheet. Review at the four approved viewport and theme profiles, with the confirmation also represented in all five supported locales.
