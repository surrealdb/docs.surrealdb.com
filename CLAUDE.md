# SurrealDB Docs

Documentation site for SurrealDB, built with Vike (React), Vite, Mantine v8, `@surrealdb/ui`, and SCSS modules.

See `AGENTS.md` for full architectural detail, content collection patterns, and rendering pipeline.

## Commands

- `bun run dev` — start dev server
- `bun run qa` — apply code quality formatting
- `bun run qc` — check full code quality

Always run `bun run qa` then `bun run qc` before finishing any task.

## Code conventions

### SOLID principles

All code should adhere to SOLID where applicable:

- **Single Responsibility** — each module, component, or function should have one reason to change.
- **Open/Closed** — extend behaviour through composition and props, not by modifying existing code.
- **Liskov Substitution** — components sharing an interface must be interchangeable without breaking consumers.
- **Interface Segregation** — keep prop interfaces and type definitions focused; avoid large catch-all types.
- **Dependency Inversion** — depend on abstractions (types, interfaces, callbacks) rather than concrete implementations.

### UI

- Use Mantine and `@surrealdb/ui` components before creating new ones.
- Use `<Box>` instead of `<div>`, `<Anchor>` instead of `<a>`.
- Prefer Mantine styling props (`mt`, `fz`, `gap`) over custom CSS.
- Use SCSS modules (`style.module.scss`) with kebab-case class names.

### Language

All user-facing text must use British English spelling (`-ise`, `-our`, `-re`, `-ogue`).

## References

- [Mantine](https://mantine.dev/llms.txt)
- [Vike](https://vike.dev/)
- [Vite](https://vite.dev/llms.txt)
- [Auth0](https://auth0.com/llms.txt)
- [vike-content-collection](https://raw.githubusercontent.com/welpie21/vike-content-collection/refs/heads/main/llms-full.txt)
