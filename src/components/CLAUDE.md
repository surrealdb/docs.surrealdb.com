# Components

## Before creating a new component

1. Check if `@surrealdb/ui` already provides it.
2. Check if Mantine has a suitable component.
3. Only create a new component if neither covers the need.

## File structure

```
ComponentName/
  index.tsx
  style.module.scss
```

## Conventions

- Use `<Box>` instead of `<div>`, `<Box component="section">` for semantic elements.
- Use `<Anchor>` instead of `<a>`.
- Prefer Mantine styling props (`mt`, `fz`, `gap`) over custom CSS.
- SCSS modules with kebab-case class names (auto-converted to camelCase in JS).
- Keep inline styles only for dynamic values.

## SOLID in components

- **Single Responsibility** — one component, one purpose. Split complex UI into focused sub-components.
- **Interface Segregation** — keep prop interfaces small and focused. Avoid catch-all prop types.
- **Dependency Inversion** — accept callbacks and data via props rather than importing concrete services directly.
