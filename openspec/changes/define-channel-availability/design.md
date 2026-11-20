# Channel availability design

Use the existing Existencias workspace and its location control. The merchant
selects a product and a channel enabled at that stock location, then asks
Inventory for its availability. The preview uses three exact fixture keys and
no stock-balance arithmetic. Channel scope matters because channels can have
different eligible protection and compete for shared stock. The current
catalogue, location and channel options are synthetic.
[JNY-007 and JNY-014](../../../../the_unnamed_2/openspec/specs/inventory-onboarding/spec.md) ·
[Protected and shared stock](../../../../the_unnamed_1/openspec/specs/inventory-commitments-availability/spec.md#requirement-protected-and-shared-stock-do-not-create-extra-stock)

Selection changes clear the previous result. Loading and failure show no
amount. The fixture returns an exact decimal string with its unit, including a
known zero, or explicitly marks the requested information unavailable. One
technical failure gives a same-selection retry. The fixture's unavailable copy
makes no claim about a protected record or a zero balance. The view cannot
reserve, change or guarantee future stock.

The public gateway supports exact product-location **recorded** stock.
Inventory's current pinned contract explicitly defers channel-aware
availability and supplies no callable read, established quantity or grant
mapping for this view. Live release needs the committed Inventory interface,
authorized discovery, method grant and browser route. The preview adds no wire
format, endpoint or inferred business outcome.
[Native availability deferral](../../../../the_unnamed_1/openspec/specs/inventory-commitments-availability-contract/spec.md#requirement-commitment-workflows-retain-their-explicit-contract-deferral) ·
[Gateway operation scope](../../../../the_unnamed_2/openspec/specs/inventory-journey-routes/spec.md#requirement-ijr-001--bounded-ready-operation-exposure)
