/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["selector","class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				montserrat: ['Montserrat','sans-serif'], // Montserrat Bold
				inter: ['Inter','sans-serif'], // Inter Font with different weights
			},
			fontWeight: {
				light: 300,     // Inter Light
				normal: 400,    // Inter Regular
				medium: 500,    // Inter Medium
				semibold: 600,  // Inter Semibold
				bold: 700,      // Inter Bold / Montserrat Bold
			},
			fontSize: {
				'3xl': ['2.25rem','2.5rem'], // 36px, 2.25rem
				'2xl': ['1.5rem','2rem'],    // 24px, 1.5rem
				xl: ['1.25rem','1.75rem'],   // 20px, 1.25rem
				lg: ['1.125rem','1.5rem'],   // 18px, 1.125rem
				md: ['1rem','1.5rem'],       // 16px, 1rem
				sm: ['0.875rem','1.25rem'],  // 14px, 0.875rem
				xs: ['0.75rem','1rem'],      // 12px, 0.75rem
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}

