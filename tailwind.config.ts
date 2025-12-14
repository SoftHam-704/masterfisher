import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                display: ["Oswald", "sans-serif"],
                body: ["Lato", "sans-serif"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                ocean: {
                    DEFAULT: "hsl(var(--ocean-blue))",
                    light: "hsl(var(--ocean-blue-light))",
                    dark: "hsl(var(--ocean-dark))",
                    deep: "hsl(var(--ocean-deep))",
                    medium: "hsl(var(--ocean-medium))",
                },
                turquoise: {
                    DEFAULT: "hsl(var(--turquoise))",
                    glow: "hsl(var(--turquoise-glow))",
                },
                golden: {
                    DEFAULT: "hsl(var(--golden))",
                    light: "hsl(var(--golden-light))",
                },
                aqua: {
                    DEFAULT: "hsl(var(--aqua))",
                    light: "hsl(var(--aqua-light))",
                },
                sand: "hsl(var(--sand))",
                sunset: "hsl(var(--sunset))",
                nature: "hsl(var(--nature-green))",
            },
            backgroundImage: {
                'gradient-ocean': 'var(--gradient-ocean)',
                'gradient-sunset': 'var(--gradient-sunset)',
                'gradient-hero': 'var(--gradient-hero)',
            },
            boxShadow: {
                'ocean': 'var(--shadow-ocean)',
                'soft': 'var(--shadow-soft)',
                'glow': '0 0 40px hsl(175 70% 45% / 0.3)',
                'glow-lg': '0 0 60px hsl(175 70% 45% / 0.4)',
                'golden': '0 8px 32px hsl(38 95% 55% / 0.35)',
            },
            transitionTimingFunction: {
                'smooth': 'var(--transition-smooth)',
                'bounce': 'var(--transition-bounce)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
                "fade-in-up": {
                    from: {
                        opacity: "0",
                        transform: "translateY(30px)",
                    },
                    to: {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                "float": {
                    "0%, 100%": {
                        transform: "translateY(0)",
                    },
                    "50%": {
                        transform: "translateY(-20px)",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in-up": "fade-in-up 0.6s ease-out forwards",
                "float": "float 6s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
