# ASD-STE100 practices for public docs

Apply ASD-STE100 Simplified Technical English so paragraphs stay clear for readers with low to moderate English or domain knowledge. Full aerospace dictionary compliance is not required for product docs; follow the **rules** below, keep vocabulary consistent, and allow product-specific technical nouns and verbs (API names, UI labels, CLI commands, protocol terms).

## Core rules

1. **Active voice** — Name the actor. Prefer `The server rejects the request.` over `The request is rejected.`
2. **One instruction per sentence** — In procedures, do not chain actions with “and then”.
3. **Short sentences** — Aim for ≤20 words in procedural sentences, ≤25 in descriptive sentences. Split when longer.
4. **Short paragraphs** — At most six sentences; prefer fewer.
5. **Simple verb forms** — Infinitive, imperative, simple present, simple past, simple future. Avoid progressive (`-ing`) verb forms when a simple form works: prefer `When the build finishes, deploy the app.` over `When the build is finishing…`.
6. **Imperative mood for steps** — `Create the project.` `Export the token.` `Click **Save**.`
7. **Consistent wording** — One approved word per meaning in a page. Do not alternate `start` / `begin` / `initiate` for the same action. Prefer the simplest common verb (`start`, `stop`, `use`, `set`, `get`, `show`, `make`, `connect`).
8. **One word, one meaning** — Do not reuse a term for two concepts on the same page without clarification.
9. **Limited noun clusters** — Avoid more than three nouns in a row. Rewrite `customer account billing configuration panel` → `panel for customer billing configuration` or `billing settings`.
10. **No filler synonyms or jargon** — Cut words that do not change meaning. Replace vague verbs (`handle`, `process`, `leverage`) with concrete ones when possible.
11. **Articles and pronouns stay clear** — If `it` or `this` could point to two nouns, repeat the noun.
12. **Technical names allowed** — Product names, class names, commands, and standard protocols stay as-is. Do not rewrite them into STE dictionary words.

## Descriptive vs procedural text

| Kind | Purpose | Pattern |
| ---- | ------- | ------- |
| Description | Explain behaviour or concepts | Short declarative sentences; define → clarify → point to action |
| Procedure | Make the reader do something | Numbered imperatives; one action; then verify |

Do not bury a procedure inside a long descriptive paragraph. Lift steps into a numbered list.

## Prefer / avoid (public-docs STE)

| Avoid | Prefer |
| ----- | ------ |
| utilise / leverage | use |
| commence / initiate | start |
| terminate (unless API term) | stop / end |
| in order to | to |
| prior to | before |
| ensure that you | make sure you / verify |
| it should be noted that | (delete; state the fact) |
| is used to | uses / use … to |
| there are many ways | (pick the recommended way; mention alternatives briefly) |
| once you have done this | after you [verb] |
| simply / just / easily | (delete) |
| powerful / seamless / robust | (delete or state a measurable fact) |

## Examples

Non-STE:

> Once the configuration has been initialised by the system, utilisation of the dashboard can be commenced in order to leverage the available insights.

STE-aligned:

> After the system starts the configuration, open the dashboard. Use the dashboard to view metrics.

Non-STE procedure:

> The token should be generated and then it needs to be exported into your environment before the application is run.

STE-aligned procedure:

> 1. Generate a token.
> 2. Export the token to your environment.
> 3. Run the application.
