export type StatusString =
    | 'future'
    | 'in development'
    | 'coming soon'
    | 'beta'
    | 'complete'
    | 'available'
    | `planned ${string}`;
