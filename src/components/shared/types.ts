export type StatusString =
    | 'future'
    | 'in development'
    | 'coming soon'
    | 'beta'
    | 'complete'
    | 'available'
    | `planned ${string}`;

export type LabelType =
    | `required${string}`
    | `${string}required`
    | `optional${string}`
    | `${string}only`;
