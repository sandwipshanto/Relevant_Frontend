// Design Tokens for Relevant App - Modern Clean Palette
export const designTokens = {
    // Modern Clean Color Palette
    colors: {
        // Primary - Sophisticated Gray-Blue
        primary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b', // Main brand
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },

        // Secondary - Warm Neutral
        secondary: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c', // Warm neutral
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
        },

        // Accent - Subtle Green
        accent: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Clean green
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },

        // Success
        success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },

        // Warning - Subtle Amber
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        },

        // Error - Muted Red
        error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
        },

        // Neutral Grays
        neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },

        // Clean Gradients
        gradients: {
            primary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
            secondary: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
            accent: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            subtle: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            warm: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
            card: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
        }
    },

    // Typography
    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            display: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
        },

        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem',    // 48px
            '6xl': '3.75rem', // 60px
        },

        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },

        lineHeight: {
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
        },
    },

    // Spacing
    spacing: {
        xs: '0.5rem',    // 8px
        sm: '0.75rem',   // 12px
        md: '1rem',      // 16px
        lg: '1.5rem',    // 24px
        xl: '2rem',      // 32px
        '2xl': '3rem',   // 48px
        '3xl': '4rem',   // 64px
        '4xl': '6rem',   // 96px
        '5xl': '8rem',   // 128px
    },

    // Border Radius
    borderRadius: {
        none: '0',
        sm: '0.375rem',  // 6px
        md: '0.5rem',    // 8px
        lg: '0.75rem',   // 12px
        xl: '1rem',      // 16px
        '2xl': '1.5rem', // 24px
        '3xl': '2rem',   // 32px
        full: '9999px',
    },

    // Shadows - Clean and Subtle
    shadows: {
        none: '0 0 #0000',
        sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
        xl: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.02)',
        '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
        inner: 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.05)',
    },

    // Animation
    animation: {
        fast: '150ms ease-out',
        normal: '300ms ease-out',
        slow: '500ms ease-out',
        spring: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // Z-Index
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060,
        notification: 1070,
    },
};
