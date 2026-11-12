# Frontend localization mechanics

## ADDED Requirements

### Requirement: LOC-001 — Explicit backoffice locale preference

The backoffice SHALL share unprefixed URLs across `es`, `en`, `ca`, `gl` and `eu`.
A valid explicit host-only cookie SHALL select the locale; otherwise Spanish
(`es`) SHALL apply. Browser language inference MUST remain disabled. Static
hosting SHALL resolve preference after HOST-002's neutral initialization. Locale
handling MUST preserve exact business values and wire semantics.

#### Scenario: First visit with an English browser

- **WHEN** a request has no valid preference cookie and prefers English through
  its browser headers
- **THEN** after initialization the backoffice renders Spanish at the shared URL
- **AND** it does not record a browser-derived language as an explicit choice.

#### Scenario: A supported explicit preference is present

- **WHEN** the browser holds a valid preference for one of the five locales
- **THEN** after initialization that locale supplies the document language and matching message resources
- **AND** the public URL remains unprefixed.

#### Scenario: An invalid preference is supplied

- **WHEN** the cookie has an unsupported locale value
- **THEN** the request uses the declared Spanish fallback without browser inference
- **AND** the cookie grants no business or account authority.

### Requirement: LOC-002 — Explicit localized landing URLs

The landing SHALL use Spanish at `/` and the other locales at `/en`, `/ca`, `/gl`
and `/eu`. The requested path SHALL determine the document language. Browser
language headers MUST NOT silently change those explicit language URLs. Initial
technical routes MUST NOT claim that marketing content, identity pages or emails
have been translated or designed.

#### Scenario: The localized technical landing is built

- **WHEN** the Astro app is built before product design
- **THEN** it generates the five declared locale entries with matching HTML language
  attributes and no invented marketing flow or content
- **AND** Spanish remains at the root rather than gaining a required `/es` prefix.

### Requirement: LOC-003 — One-year host-only language cookie

An explicit backoffice language choice SHALL be retained in a host-only preference
cookie with a maximum age of 31,536,000 seconds (365 days). The cookie MUST NOT
imply an account-level or cross-device preference or supply business authority.
This mechanism MUST NOT introduce an unapproved language-picker design or claim
that browser persistence has been visually tested.

#### Scenario: Explicit language-selection support is configured

- **WHEN** explicit preference selection supplies the cookie attributes
- **THEN** it uses the chosen one-year duration, root path and no Domain attribute
- **AND** the preference remains separate from future authentication/session policy
  or account-preference integration.
