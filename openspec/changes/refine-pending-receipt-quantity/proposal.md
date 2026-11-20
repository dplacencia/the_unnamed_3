# Make a partial receipt correction easier to verify

## Why

A Pending receipt can retain the originally reported amount even when only
part of the delivery arrived. The merchant needs to see the original amount
while they enter the smaller actual amount, understand the permitted quantity
rules, and distinguish that input from Inventory's confirmed effect.

## What changes

- Start a separate Storybook walkthrough at the existing Pendientes list.
  Offer Revisar cantidad from the exact inspector after it confirms Pending.
- Keep the recorded facts and reason visible. Make the existing exact
  quantity rule visible beside the field and explain an incompatible input.
- In the confirmed result, show the originally recorded amount, the amount
  the merchant indicated, and the exact effect returned by the fixture.
  Use the existing list refresh and return.

The [Pending resolution specification](../define-pending-resolution-workspace/specs/pending-resolution-workspace/spec.md)
governs the synthetic walkthrough.
