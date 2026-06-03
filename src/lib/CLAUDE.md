# Shared libraries

Shared helpers, hooks, API functions, and caching utilities.

## Key modules

- `categories.ts` — loads `__category.json` files for sidebar structure
- `helpers.ts` — general-purpose utility functions
- `images.ts` — image URL resolution and processing
- `markdown.ts` — markdown parsing helpers
- `cache/` — caching layer
- `versions/` — SDK version management

## SOLID in utilities

- **Single Responsibility** — one module per concern. Don't mix unrelated helpers.
- **Open/Closed** — extend behaviour through parameters and options, not by modifying existing functions.
- **Dependency Inversion** — accept dependencies as arguments rather than hard-coding imports to concrete modules.
