/** @type {import('tailwindcss').Config} */
export default {
	mode: 'jit',
	darkMode: "class",
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
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				chart: {
					'1': 'var(--chart-1)',
					'2': 'var(--chart-2)',
					'3': 'var(--chart-3)',
					'4': 'var(--chart-4)',
					'5': 'var(--chart-5)'
				},
				gray: {
					50: '#FCFCFD', // Opacity: 90%
					100: '#F0F1EA',
					200: '#E5E5E1',
					300: '#FCFCFD',
					400: '#DEE0D8',
					500: '#C8CAC2',
					600: '#8F9288',
					700: '#5E6058',
					800: '#22221E',
				},
				green: {
					50: '#EFF8CC',
					100: '#CEE967',
					200: '#BEE234',
					300: '#AEDB01', // Main Green
					400: '#90B406',
					500: '#637A0D',
					600: '#232C00',
				},
				red: {
					50: '#F3D8DB',
					100: '#EEC8CC',
					200: '#C97973',
					300: '#A52015',
					400: '#841A11',
					500: '#692327',
					600: '#210604',
				},
				yellow: {
					50: '#FDF0D9',
					100: '#F9D28D',
					200: '#F7C367',
					300: '#F5B441',
					400: '#936C27',
					500: '#62481A',
					600: '#31240D',
				},
				information: {
					50: '#DBE3F8',
					100: '#B7C7F0',
					200: '#6E8EE1',
					300: '#4972DA',
					400: '#3B5BAE',
					500: '#1E2E57',
					600: '#0F172C',
				},

				// Dark mode colors
				'dark-gray': {
					50: '#EEEEEE',
					100: '#A8A8A8',
					200: '#5F5F5F',
					300: '#545454',
					400: '#393939',
					500: '#262626',
					600: '#191919',
				},
				'dark-green': {
					50: '#EFF8CC',
					100: '#CEE967',
					200: '#BEE234',
					300: '#AEDB01', // Main Green
					400: '#90B406',
					500: '#637A0D',
					600: '#232C00',
				},
				'dark-red': {
					50: '#F7DCDC',
					100: '#EFB9B9',
					200: '#E07272',
					300: '#D84F4F',
					400: '#822F2F',
					500: '#562020',
					600: '#2B1010',
				},
				'dark-yellow': {
					50: '#FDF0D9',
					100: '#F9D28D',
					200: '#F7C367',
					300: '#F5B441',
					400: '#936C27',
					500: '#62481A',
					600: '#31240D',
				},
				'dark-information': {
					50: '#DBE3F8',
					100: '#B7C7F0',
					200: '#6E8EE1',
					300: '#4A72DA',
					400: '#3B5BAE',
					500: '#1E2E57',
					600: '#0F172C',
				},
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}

