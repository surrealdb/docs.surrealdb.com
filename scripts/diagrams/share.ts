// Copies the figures listed in shared.json to public/diagrams, where
// SurrealDB University lessons link to them. See shared.ts.
//
//   bun scripts/diagrams/share.ts

import { publishShared } from "./shared";

const changed = publishShared();
console.log(changed.length ? changed.join("\n") : "Shared figures are up to date.");
