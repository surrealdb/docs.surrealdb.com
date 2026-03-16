---
description: Instructions for writing concept documentation pages
globs: "**/*.{md,mdx}"
alwaysApply: false
---

# Instructions for writing concept documentation pages

## File structure

Every concept page follows this exact structure in order:

1. **Frontmatter** (YAML)
2. **Imports** (only as needed)
3. **H1 heading**
4. **Introduction paragraph(s)**
5. **API References section** (HTML table)
6. **Body sections** (H2 headings with prose + code)
7. **Learn more section** (bullet list of links)

---

## 1. Frontmatter

Use exactly these four fields. No others.

```yaml
---
sidebar_position: <number>
sidebar_label: <Short label>
title: <Product> | <Category> | <Label>
description: <One sentence describing what the page covers.>
---
```

- `sidebar_label` should be 1-3 words describing the topic.
- `title` follows a consistent hierarchy pattern separated by pipes.
- `description` is a single sentence. It should open with the product or SDK name.

*Example:*

```yaml
---
sidebar_position: 5
sidebar_label: Live queries
title: JavaScript | SDK | Live queries
description: The JavaScript SDK supports real-time live queries that stream changes from the database to your application.
---
```

## 2. Imports

Only import components you actually use. If the page has no tabs or labels, omit all imports. Never import deprecated or legacy components.

## 3. H1 heading

A single `# Heading` that matches the `sidebar_label` exactly. Nothing else on this line.

## 4. Introduction

One or two paragraphs immediately after the H1. The introduction should:

- Explain **what** the feature is and **why** a developer would use it.
- Mention the key classes, methods, or concepts involved at a high level — without going into detail.
- Link to relevant documentation in other parts of the docs using inline markdown links.
- Never include method-name headings or code blocks.

Write in a tone that orients the reader before they dive into specifics. Assume the reader knows the product but not this particular feature.

*Example tone:*

> Live queries allow your application to receive real-time notifications whenever records in the database are created, updated, or deleted. The SDK provides two approaches: managed queries that are automatically restarted on reconnect, and unmanaged queries that you create manually and subscribe to.
> 

Optional: Include a callout (`> [!NOTE]` or `> [!WARNING]`) directly after the introduction if there is an important prerequisite or constraint.

## 5. API References section

Immediately after the introduction (and any callout), include an `## API References` section containing a raw HTML table that lists the key methods, classes, or utilities covered on the page. Every row links to the corresponding detailed API reference page.

```html
<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="/docs/path/to/reference#anchor"> <code> instance.method(args) </code></a></td>
			<td scope="row" data-label="Description">One-line description starting with a verb</td>
		</tr>
	</tbody>
</table>
```

Rules:

- The first column header label should match what is being listed: "Method", "Utility", "Error class", "Class", etc.
- The `data-label` attributes on `<td>` elements must match the corresponding column header text.
- Link the first column cell to the anchor on the relevant API reference page.
- Wrap the method or class name in `<code>` inside the link.
- Descriptions are short (one line), present tense, starting with a verb ("Creates", "Signs in", "Thrown when").
- Include the method signature in the code cell (e.g. `instance.method(arg1, arg2?)`). Use `?` for optional parameters.
- If the complete list is very long, show only the most important items and add a note below the table linking to the full reference.

## 6. Body sections

Each body section is an `## H2 heading` followed by explanatory prose and code examples.

## Heading style

- Headings describe an **action, use case, or feature** — never a method name, property name, or class name.
- Good: "Signing in users", "Creating a managed subscription", "Handling connection errors", "Automatic restart on reconnect"
- Bad: "`.signin()`", "`db.live()`", "`ConnectionError`"

## Prose style

- Every code block is preceded by at least one sentence of explanation. Never place two code blocks back-to-back without prose between them.
- Refer to methods using backtick-wrapped inline code with the `.` prefix: `.signin()`, `.connect()`.
- Refer to classes and types using backtick-wrapped inline code with a markdown link on first mention: `[RecordId](/docs/path/to/reference)`. Subsequent mentions can be plain backtick code without a link.
- Write in second person ("you can", "you must") and present tense.
- Cross-link to other concept pages and reference documentation where relevant.
- Avoid filler phrases: "In order to" (use "To"), "It is important to note that" (just state it), "As mentioned above" (remove or restructure).

## Code blocks

- Use the appropriate language tag (e.g. ````ts`, ````bash`, ````json`). No `title` attribute.
- Keep examples minimal and focused — demonstrate one concept per block.
- Use realistic but simple values.
- Include import statements only in the first code block that uses those imports, or when introducing a new import. Do not repeat imports across blocks on the same page.
- Do not include comments that narrate what the code does (e.g. `// Select all users`). Only include comments that clarify non-obvious behavior or distinguish between alternatives.

## Tables

- Use markdown tables for simple reference data (options, actions, event types, protocol comparisons).
- Use HTML tables only for the API References section at the top of the page.

## Tabs

- Use tab components when showing mutually exclusive alternatives (e.g. different authentication levels, different update strategies, different package managers).
- Each tab needs a unique `value` and human-readable `label`. The `groupId` should be descriptive.
- Include a brief line of prose inside each tab before the code block.

## Callouts

- Use `> [!NOTE]` for supplementary information the reader should be aware of.
- Use `> [!WARNING]` for things that could cause problems if ignored.
- Use callouts sparingly — at most 2-3 per page.

## Subheadings

- Use `### H3` for subsections within an H2.
- Use `#### H4` sparingly, only for sub-sub-sections within an H3.

## 7. Learn more section

End every page with `## Learn more` followed by a bullet list of 3-8 related links. Each item is a markdown link followed by a brief lowercase description.

```markdown
# Learn more

- [API reference page](/docs/path/to/reference) for detailed method signatures
- [Related concept page](/docs/path/to/concept) for related feature setup
- [Language reference](/docs/path/to/language/feature) for the query language syntax
```

Rules:

- Link to the relevant API reference pages first.
- Then link to related concept pages.
- Then link to broader product documentation.
- Descriptions start with "for" in lowercase and are not full sentences.
- No trailing period on any item.

---

## General rules

- **No legacy content or version tabs.** All content targets the current version of the product only.
- **No emojis** in any content.
- **No method-name or class-name headings.** Body section headings always describe what the user is doing or what the feature provides.
- **Link on first mention.** The first time a class, type, or concept page is referenced in a section, wrap it in a link. Subsequent mentions in the same section can be plain backtick code.
- **Prefer concept-level explanations.** These pages explain *how to use* features with brief, practical examples. Detailed parameter tables, return types, and overloads belong in the API reference pages. Link to them rather than duplicating.
- **One idea per section.** Each H2 should cover a single topic. If a section grows beyond two code blocks, consider splitting it.
- **Consistent voice.** Write as a knowledgeable colleague explaining a feature — direct, precise, and free of marketing language or superlatives.