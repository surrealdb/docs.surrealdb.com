---
name: documentation
description: >-
  Writes and rewrites public-facing product documentation with a semi-technical
  tone, ASD-STE100 Simplified Technical English, clear structure, and careful
  disclosure. Use whenever documentation is written — including new guides,
  quickstarts, reference pages, overviews, how-tos, explanations, README docs,
  and rewrites of existing doc text for a public audience.
metadata:
  author: surrealdb
  version: "0.1.0"
---

# Documentation

Write public product documentation that a new or moderately experienced reader can follow without guesswork, marketing filler, or internal leakage.

## Modes

**Rewrite** — User provides existing text (paste, file path, or selection). Preserve factual intent. Restructure, rephrase, and cut until the result matches this skill. Do not invent features.

**Write** — User provides a topic, outline, or brief. Ask only for missing facts that would make the page wrong or unsafe. Then draft a complete page in this style.

If the mode is unclear, infer from the prompt. If both source text and a new topic appear, prefer rewrite of the source unless the user asks for a new page.

## Workflow

Copy and track:

```text
Documentation progress:
- [ ] 1. Gauge audience and disclosure level
- [ ] 2. Choose page type and skeleton
- [ ] 3. Draft in voice + STE
- [ ] 4. Add structure (lists, tables, callouts, code)
- [ ] 5. Public-safety pass (secrets, internals, over-share)
- [ ] 6. Final read for rhythm and consistency
```

### 1. Audience and disclosure

Default audience: **low to moderate** knowledge of the topic. Define terms on first use. Prefer concrete steps and examples over theory.

Before writing, decide:

| Question                                                   | If yes                              | If no             |
| ---------------------------------------------------------- | ----------------------------------- | ----------------- |
| Must the reader act on this to succeed?                    | Include                             | Cut or link out   |
| Is this public product behaviour?                          | Include                             | Keep internal     |
| Would a competitor or attacker misuse this detail?         | Soften or omit                      | Include if useful |
| Is a secret, token, path, hostname, or private ID present? | Remove or replace with placeholders | Keep              |
| Does elaboration reduce confusion for a moderate reader?   | Add one short clarifying sentence   | Stay brief        |

Public docs disclose **what the reader needs to succeed**, not how the organisation builds, staffs, or roadmaps the product. Prefer stable interfaces, recommended paths, and user-visible behaviour. Omit staff names, internal tools, unreleased plans, private URLs, and implementation trivia that does not change how the reader uses the product.

When audience is expert (API reference, deep ops), raise density and shorten definitions—but keep STE clarity and the same disclosure rules.

### 2. Page types

Pick one primary type per page:

| Type                  | Opens with                                                | Body                                                                      | Closes with                 |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------- |
| Overview / hub        | One-line purpose + what the reader gets                   | Grouped links or cards; each item = bold title + one descriptive sentence | Optional “next steps” group |
| Quickstart / tutorial | Goal + success criteria (“when complete, you will have…”) | Prerequisites → numbered steps → verify                                   | Short “next steps” list     |
| How-to                | Task outcome in one sentence                              | Numbered procedure; one action per step                                   | Result check                |
| Reference             | Syntax or surface area first                              | Parameters, returns, constraints in tables                                | Minimal narrative           |
| Explanation           | The question the page answers                             | Short sections; diagrams or tables for comparisons                        | Links to related how-tos    |

Do not mix tutorial pacing with reference density on the same page unless the project already does that pattern.

### 3. Voice, tone, and prose

Match this house style:

**Voice**

- Second person for tasks (`you`, `your app`).
- Third person for product facts (`The API returns…`).
- Address the reader as a peer building something—not a student in a lecture, not a marketing lead.

**Tone**

- Semi-technical, calm, instructional.
- Confident without hype. No “powerful”, “seamless”, “robust”, “modern”, “end-to-end”, or “dive in”.
- Warmth is allowed in small doses on long tutorials (“After the app responds, stop the process with `Ctrl+C`”)—never cheerleading.

**Sentence structure**

- Lead the page with **purpose in one sentence**, then optionally one clarifying fact that prevents a common misunderstanding.
- Prefer **subject–verb–object**. Keep most sentences under ~25 words (descriptions) or ~20 words (steps).
- One idea per sentence. One instruction per procedural sentence.
- Short paragraphs: usually 1–3 sentences. Rarely more than 4.
- Use present tense for behaviour; imperative for steps; simple future only for outcomes (“You will get a token”).
- Parallel structure in lists: same grammatical shape for every item.
- Bridge steps with one plain sentence when context would otherwise jump (“With the toolchain ready, create the project”).

**Phrasing patterns that fit**

- Purpose line: `Use [product] to [verb], [verb], and [verb] [object].`
- Clarifying correction: `You get a full [X], not a [misleading abstraction].`
- Branching audience: `If you are new to [topic], start with [basics]. If you already know [topic], go to [build].`
- Outcome frame: `When you finish, you will have [concrete result].`
- List annotation: `**[Title]:** [What it is or when to use it].`
- Caution inline: put the warning in the same list item or in a callout—not three paragraphs later.
- Recommendation with escape hatch: `Use [default] for the simplest path. [Alternative] remains available.`

**Avoid**

- Throat-clearing openings and blog framing.
- Passive voice when an actor exists.
- Synonym cycling for the same action (`start` / `begin` / `initiate` / `kick off`).
- Stacked noun clusters longer than three nouns.
- Em dashes used as decoration; stacked adjectives; rule-of-three padding.
- Leaking internal codenames, sprint language, or “we currently hack around…”.

Apply **ASD-STE100 Simplified Technical English** as specified in [references/ste.md](references/ste.md). Product and API names are allowed technical nouns/verbs; do not force awkward rewrites of proper names.

### 4. Structure and formatting

Structure carries meaning. Do not leave everything in prose blocks.

- **Headings:** sentence case; short; describe the section’s job.
- **Bullets:** options, prerequisites, related pages, next steps. Bold the lead phrase when scanning helps.
- **Numbered lists:** procedures only; one action per step; expected UI labels in **bold**.
- **Tables:** comparisons, parameters, modes, “when to use A vs B”.
- **Code fences:** runnable commands and snippets; show expected output when it helps the reader verify.
- **Callouts:** `NOTE` for tips, `WARNING` / `IMPORTANT` for safety, data loss, or secrets.
- **Placeholders:** `<your-token>`, `YOUR_PROJECT_ID`—never real credentials.
- **Links:** push depth outward; keep the current page focused.
- **Hub pages:** title + one-line description per destination beats long essays.

### 5. Public-safety pass

Before finishing, scan for:

- Secrets, tokens, private keys, session cookies
- Absolute personal paths (`/Users/…`)
- Internal hostnames, staging URLs, VPN-only endpoints
- Staff names, customer names, private tickets
- Unreleased features presented as available
- Architecture detail that only helps attackers or is contractually internal

Replace with placeholders or delete. If a security practice matters, state the rule without exposing live values.

### 6. Final read

Read once as a moderate newcomer. Confirm: purpose clear in the first screenful, every step actionable, terms defined, no AI filler, STE rules held, structure used where comparison or sequence matters.

## Output

Return the documentation in the project’s usual format (Markdown/MDX unless asked otherwise). Do not wrap the whole page in commentary. If you made disclosure cuts or audience assumptions, add a short note **after** the draft only when the user would need to confirm a fact.

## Examples

Anonymised samples of target phrasing: [references/examples.md](references/examples.md).

## STE reference

Rules and approved-style substitutions: [references/ste.md](references/ste.md).
