# Airport Security Prep — Project Context

## Purpose

Airport Security Prep is a static Progressive Web App for independent educational preparation for recruitment processes in airport security.

It must remain generic and independent.

The application must NOT imply affiliation, sponsorship, approval or official connection with any specific employer, airport operator, recruitment agency or public authority.

Preferred generic terminology:

- Airport Security Prep
- security aeroportuale
- airport security
- recruitment assessment
- test psico-attitudinale
- English B2
- interview preparation
- colloquio
- assessment

Preferred description:

“Simulatore didattico indipendente per la preparazione a selezioni in ambito security aeroportuale.”

---

## Technology

The project intentionally uses:

- HTML
- CSS
- Vanilla JavaScript
- Web App Manifest
- Service Worker
- localStorage
- GitHub Pages

Do NOT introduce without explicit user approval:

- React
- Vue
- Angular
- Vite
- npm
- TypeScript
- external frameworks
- build systems
- unnecessary dependencies

Keep the application simple and static.

---

## Main pages

### index.html

Main portal / landing page.

Provides access to:

- Psychometric assessment
- English B2
- Interview preparation

### assessment.html

Psychometric and aptitude test application.

Current question bank: 620 questions total:

- perceptual attention: 120
- abstract reasoning: 100
- numerical reasoning: 100
- verbal reasoning: 100
- concentration: 70
- Situational Judgement Test: 60
- in-basket / prioritisation: 30
- behavioural / personality questionnaire: 40

Current main assessment: 100 questions across 7 timed sections, 60 minutes total:

- perceptual attention: 25 questions, 8 minutes
- abstract reasoning: 20 questions, 12 minutes
- numerical reasoning: 15 questions, 10 minutes
- verbal reasoning: 15 questions, 10 minutes
- concentration: 10 questions, 6 minutes
- Situational Judgement Test: 10 questions, 9 minutes
- in-basket / prioritisation: 5 questions, 5 minutes

Current available modes:

- Assessment completo: fixed 100-question, 60-minute assessment
- Allenamento: configurable categories and question count, immediate feedback
- Esame libero: configurable categories, question count and timer, immediate feedback
- Stile comportamentale: 40 non-scored items, 12 minutes

Custom question-count options are 20, 50, 100, 200, 300 and 500. Custom timer options are unlimited, 20, 30, 45, 60 and 90 minutes.

Do not guess these values. Re-read the actual code whenever documenting a future change.

### english.html

Dedicated English B2 test. English remains separate from the main psychometric assessment.

Current English bank: 120 questions:

- Grammar B1/B2: 30
- Airport vocabulary: 25
- Reading comprehension: 25
- Passenger interaction: 25
- Security instructions: 15

Current modes:

- Test completo: 60 questions, 45 minutes
- Test rapido: 30 questions, 25 minutes
- Allenamento: 30 questions, no timer

All modes use the same immediate answer-locking and correctness-feedback behaviour described below.

Do not guess these values. Re-read the actual code whenever documenting a future change.

### colloquio.html

Interview preparation guide for generic airport security recruitment.

Includes topics such as:

- motivation
- knowledge of the role
- night shifts
- weekends
- public holidays
- working under pressure
- difficult passengers
- teamwork
- following procedures
- reliability
- strengths
- areas for improvement
- English ability

---

## Critical quiz behaviour

For EVERY scored question in every test:

1. The first answer click is FINAL.
2. The answer is immediately locked.
3. The user cannot change the answer.
4. If the selected answer is correct, highlight it GREEN.
5. If the selected answer is incorrect, highlight it RED and simultaneously highlight the correct answer GREEN.
6. Show the existing explanation immediately when available.
7. No second attempt is permitted.
8. No answer change is permitted.
9. The user proceeds using the Next button.
10. Previous-question navigation must not allow answers to be edited.
11. Resumed sessions must preserve locked answers.

This behaviour must remain consistent across:

- Assessment
- Free exam
- Practice/training
- English B2
- any future scored test

Do NOT change this behaviour unless the user explicitly asks.

---

## Personality / behavioural questionnaire exception

Personality questions do NOT have a correct or incorrect answer.

For these:

- do not show green/red correctness
- lock the selected answer after the first click
- do not allow changing it
- allow progression to the next question

---

## Critical invariants

Do NOT modify unless explicitly requested:

- question wording
- answer options
- correct-answer mapping
- scoring logic
- timers
- question counts
- localStorage behaviour
- saved statistics
- immediate green/red feedback
- answer locking
- navigation rules
- assessment section timing

When making unrelated changes, verify these remain unchanged.

Current assessment persistence keys are `securityAssessmentSessionV3` and `securityAssessmentStatsV3`. The saved-session schema version is `4.0.0`.

Question objects expose a backward-compatible `family` metadata field. Explicit fine-grained families are used where available; otherwise the category is used as the family fallback. The `diff` field is an editorial estimate of cognitive load: `1` easy, `2` medium, `3` hard. It is not a validated psychometric measurement.

Question objects also expose an optional backward-compatible `mechanism` field for describing the solution process within a family. Code consuming older question objects must continue to tolerate a missing or `null` mechanism.

Bank V2 Phase 2A status:

- Attention V2 Phase 2A draft: 120 items across `code_compare`, `mismatch_detection`, `selective_search`, `symbol_count`, `multi_field_match`, `transposition_detection`, `consistency_check` and `exception_detection` (15 each). Editorial difficulty: 30 easy, 60 medium, 30 hard. Strict item-level cognitive uniqueness is estimated at approximately 55%; further editorial diversification is required to reach the 70% target.
- Concentration V2 Phase 2A draft: 70 items across `sustained_scan`, `rule_switch`, `interference_filter`, `multi_condition`, `sequential_tracking`, `multi_compare` and `alternating_rule` (10 each). Editorial difficulty: 17 easy, 36 medium, 17 hard. Arithmetic-primary share: 20/70 (approximately 29%). Strict item-level cognitive uniqueness is estimated at approximately 50%; further editorial diversification is required to reach the 70% target.
- Every Attention and Concentration item has an explicit non-generic `family`; current sampling behaviour is unchanged.
- Phase 2A.1 adds `mechanism` metadata and deterministic non-cyclic answer-position plans. Attention answer positions are 30/30/30/30 with maximum run 3; Concentration positions are 18/18/17/17 with maximum run 3. Neither plan has a four-position cycle. Strict post-audit still places Attention at approximately 55% and Concentration at approximately 50% cognitive uniqueness; mechanism labels do not by themselves count as diversification, so the top-tier 70% target remains open.
- Phase 2A.2 semantically rewrites 40 Attention and 28 Concentration items using explicit editorial overrides that change stem structure, solution procedure, distractors and explanations. Strict post-classification is Attention A/B/C/D = 0/14/78/28 (approximately 88% C+D) and Concentration = 0/7/45/18 (90% C+D). Family and mechanism remain explicit; answer distributions and maximum runs remain 30/30/30/30, run 3 for Attention and 18/18/17/17, run 3 for Concentration.

Release Candidate bank cleanup:

- Attention V2 and Concentration V2 are frozen and unchanged.
- Targeted semantic replacements: 6 Abstract, 10 Numerical, 10 Verbal, 2 SJT, 6 In-basket and 8 Personality items.
- Numerical replacements add averages, fractions, percentage changes, ratios, conversions and multi-step rate reasoning; every result is explicitly derived in its explanation.
- Verbal replacements add implication, contraposition, quantified exclusion and relational-order items with formal Vero/Falso/Non determinabile explanations.
- The fixed assessment now samples by category while balancing editorial difficulty and preferring underrepresented families. Training and free-exam sampling behaviour is unchanged.
- Bank totals, assessment structure, timers, scoring, persistence, feedback and navigation remain unchanged.

---

## BANK V2 QUALITY TARGET

- Keep the bank at exactly 620 total questions unless an explicit future request changes the count.
- Target 65â€“75% cognitively distinct items rather than cosmetic variants.
- Target an approximate difficulty distribution of 25% easy, 50% medium and 25% hard.
- Use plausible distractors and specific, scenario-aware explanations.
- Do not count cosmetic duplication as substantive variety.
- SJT items should offer at least two alternatives that appear initially plausible, with one defensible best or least-effective answer.
- Future sampling should support stratification by `family` and `diff` without changing current quiz behaviour.
- Do not claim official psychometric validation, certification or equivalence.

---

## PWA architecture

The application is an installable Progressive Web App.

Important files:

- manifest.webmanifest
- pwa.js
- sw.js
- icons/

The Service Worker must:

- support offline use
- precache the main application
- use same-origin GET handling
- work correctly on GitHub Pages
- use relative paths
- avoid root-relative paths

GOOD: `./style.css`

BAD: `/style.css`

The application is hosted inside a GitHub Pages repository subpath, so root-relative paths can break deployment.

---

## Service Worker cache version

Whenever HTML, CSS, JavaScript, manifest, icons or other precached application assets are changed, review the Service Worker cache version.

Current naming convention: `airport-security-prep-vX`

Examples:

- `airport-security-prep-v3`
- `airport-security-prep-v4`

Increment the version when necessary so installed PWAs receive updated assets.

Do NOT change the caching strategy unless explicitly requested.

CURRENT CACHE VERSION: `airport-security-prep-v9`

---

## Deployment

The application is deployed with GitHub Pages.

Expected configuration:

- branch: main
- folder: /(root)
- index.html in repository root

Keep internal URLs compatible with a repository path such as:

`https://username.github.io/repository-name/`

---

## Branding

Current application name: Airport Security Prep

The app must remain generic.

Do not introduce references suggesting affiliation with a specific employer, recruitment company or authority.

Before completing any future modification, perform a case-insensitive search for names or identifiers associated with previous employers, airport operators, recruitment agencies, public authorities or earlier project branding.

Remove such references unless they are strictly required for a user-approved technical migration or another explicit user-approved reason.

---

# MANDATORY DOCUMENTATION MAINTENANCE RULE

THIS SECTION IS CRITICAL.

AGENTS.md is living project documentation and MUST ALWAYS remain synchronized with the real project.

EVERY AI agent that changes ANY project file must also review AGENTS.md during the same task.

THE USER MUST NOT HAVE TO ASK FOR THIS.

After EVERY project modification:

1. Read AGENTS.md.
2. Determine whether any documented fact has changed.
3. Update AGENTS.md during the same task.
4. Verify that question counts, modes, timers, cache version, architecture, branding and behavioural rules recorded here still match the actual code.
5. Update the “Last verified” section.
6. Add a concise entry to the Change Log.
7. Never leave AGENTS.md describing an older state of the application.

Even for a small modification, AGENTS.md MUST at minimum be reviewed.

If the change does not alter any documented project fact:

- still update the Last verified entry
- add a short Change Log entry stating what was changed and that project invariants were unaffected

This maintenance rule applies automatically.

The user does NOT need to repeat “update AGENTS.md”.

Treat updating this documentation as part of the Definition of Done for EVERY future change.

A task that modifies the project but does not review/update AGENTS.md is INCOMPLETE.

---

## AI agent workflow

Before modifying anything:

1. Read AGENTS.md completely.
2. Inspect the relevant existing files.
3. Understand the current implementation.
4. Make the smallest necessary change.
5. Do not refactor unrelated code.
6. Do not modify question banks unless explicitly requested.
7. Preserve scoring and timers unless explicitly requested.
8. Preserve PWA compatibility.
9. Preserve relative paths.
10. Review Service Worker cache version.
11. Run appropriate validation.
12. Update AGENTS.md before finishing.

---

## Validation checklist

After every modification verify as applicable:

- JavaScript syntax
- manifest validity
- internal links
- missing assets
- GitHub Pages relative paths
- Service Worker registration
- cache version
- offline precache
- question count
- correct-answer mapping
- scoring
- timers
- localStorage
- statistics
- immediate answer feedback
- answer locking
- Personality exception
- branding neutrality

Never claim a check was performed if it was not actually performed.

---

## Change discipline

Prefer:

- small targeted changes
- minimal diffs
- existing architecture
- existing styles
- existing utilities

Avoid:

- unsolicited redesigns
- unnecessary rewrites
- unnecessary dependencies
- architecture changes
- speculative improvements

If the user asks for one feature, implement that feature rather than redesigning the application.

---

## Security and privacy

Never place inside the repository:

- passwords
- API keys
- GitHub tokens
- credentials
- private personal data
- authentication secrets

Do not expose secrets in HTML or JavaScript.

---

## Last verified

Date: 2026-08-30

Project name: Airport Security Prep

Question bank: 620 total (120 attention, 100 abstract, 100 numerical, 100 verbal, 70 concentration, 60 situational, 30 in-basket, 40 personality)

English bank: 120 total (30 grammar, 25 vocabulary, 25 reading, 25 dialogue, 15 instructions)

Main assessment: 100 questions, 7 sections, 60 minutes

Service Worker cache: `airport-security-prep-v9`

Deployment: GitHub Pages

Status: Release Candidate static installable PWA with frozen Attention/Concentration V2 banks, targeted cleanup across the remaining assessment categories, stratified fixed-assessment sampling, relative paths, offline precache, persistent sessions/statistics and unchanged first-click answer locking and immediate feedback.

---

## Change Log

### 2026-08-30

- Completed the Release Candidate bank cleanup with 42 targeted replacements across Abstract, Numerical, Verbal, SJT, In-basket and Personality; Attention and Concentration were not modified.
- Added family/difficulty-aware sampling to the fixed assessment while preserving section counts and timings; custom modes are unaffected.
- Incremented the Service Worker cache from v8 to v9 for the updated precached JavaScript; caching strategy is unchanged.

### 2026-08-29

- Completed Bank V2 Phase 2A.2 with 40 explicit Attention and 28 explicit Concentration semantic rewrites; strict post-classification reaches approximately 88% and 90% C+D respectively.
- Incremented the Service Worker cache from v7 to v8 for the updated precached JavaScript; caching strategy is unchanged.
- Added backward-compatible `mechanism` metadata for Attention and Concentration and replaced the visible `index % 4` answer cycle with balanced seeded plans; semantic uniqueness remains below target after strict review.
- Incremented the Service Worker cache from v6 to v7 for the updated precached JavaScript; caching strategy is unchanged.
- Prepared the Bank V2 Phase 2A draft for all 120 Attention and 70 Concentration items, separating perceptual-verification tasks from sustained rule-processing tasks; post-audit still requires further item-level diversification.
- Added eight explicit Attention families and seven explicit Concentration families, balanced answer positions and documented difficulty, uniqueness and arithmetic-share estimates; other banks and quiz behaviour are unchanged.
- Incremented the Service Worker cache from v5 to v6 for the updated precached JavaScript; caching strategy is unchanged.
- Completed Bank V2 Phase 1: corrected audited P0 attention/verbal mappings, introduced structurally distinct deduction exercises and rewrote six ambiguous SJT items with specific explanations.
- Added backward-compatible `family` metadata, documented the editorial `diff` semantics and recorded Bank V2 quality targets; quiz counts and behavioural invariants remain unchanged.
- Incremented the Service Worker cache from v4 to v5 for the updated precached JavaScript; caching strategy is unchanged.
- Sanitized public AI-agent documentation by replacing specific legacy names with generic branding-neutrality rules; project invariants were unaffected.
- Updated the Service Worker to cache v4, added targeted cleanup for legacy cache prefixes, and limited cache lookup to the current cache.
- Corrected assessment and English mode descriptions to state that feedback is immediate; quiz invariants were unaffected.

- Created canonical AI-agent project documentation from the current implementation.
- Recorded current banks, modes, timers, PWA cache, branding and quiz-behaviour invariants; no application file was changed.

---

## Golden rule

The project should remain:

simple,
static,
portable,
offline-capable,
GitHub Pages compatible,
generic in branding,
and easy for another developer or AI agent to understand.

Do not make the architecture more complicated without a clear user request.
