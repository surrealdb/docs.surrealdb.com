/** @type {import('tailwindcss').Config} */

function withOpacity(name) {
    return ({ opacityValue }) =>
        opacityValue === undefined
            ? `rgb(var(--color-${name}))`
            : `rgba(var(--color-${name}), ${opacityValue})`;
}

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                bw: withOpacity('bw'),
                bwr: withOpacity('bwr'),
                background: {
                    DEFAULT: withOpacity('background-primary'),
                    secondary: withOpacity('background-secondary'),
                    tertiary: withOpacity('background-tertiary'),
                },
                text: withOpacity('text'),
                hover: withOpacity('hover'),
                code: withOpacity('code'),
                border: withOpacity('border'),
                faint: withOpacity('faint'),
                footer: 'var(--color-footer)',
                'dropdown-backdrop': 'var(--color-dropdown-backdrop)',
                'dropdown-background': withOpacity('dropdown-background'),
                'feature-complete': withOpacity('feature-complete'),
                'feature-beta': withOpacity('feature-beta'),
                'feature-planned': withOpacity('feature-planned'),
                'feature-future': withOpacity('feature-future'),
                'surreal-pink': withOpacity('surreal-pink'),
                'surreal-purple': withOpacity('surreal-purple'),
                'quote-note': withOpacity('quote-note'),
                'quote-important': withOpacity('quote-important'),
                'quote-warning': withOpacity('quote-warning'),
                'quote-caution': withOpacity('quote-caution'),
                'label-yellow': withOpacity('label-yellow'),
                'label-grey': withOpacity('label-grey'),
                'label-purple': withOpacity('label-purple'),
            },
            screens: {
                xs: '390px',
            },
            maxWidth: {
                container: '1200px',
            },
        },
        fontFamily: {
            sans: "ui-sans-serif,system-ui,-apple-system,'Inter','Helvetica Neue','Helvetica','Arial',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
            mono: "ui-monospace,'SF Mono','SFMono-Regular','DejaVu Sans Mono','Menlo','Consolas',monospace",
        },
        data: {
            active: 'ui~=active',
        },
    },
    plugins: [],
};
