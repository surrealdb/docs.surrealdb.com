declare global {
    export interface Window {
        /** The Google tag's command queue, defined by the website's `/analytics.js`. */
        dataLayer?: unknown[];
        /** The Google tag, defined by the website's `/analytics.js`. */
        gtag?: (...args: unknown[]) => void;
        /**
         * The website's event helper, defined by `/analytics.js` where it
         * exists. It sends a Google Analytics event with the site's shared
         * defaults.
         */
        sdbTrack?: (name: string, params?: Record<string, unknown>) => void;
    }
}

export {};
