/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const plugin = require('tailwindcss/plugin')
export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			plusJK: [
  				'var(--font-plus-jakarta-sans)'
  			]
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
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 var(--pulse-color)'
  				},
  				'50%': {
  					boxShadow: '0 0 0 8px var(--pulse-color)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			pulse: 'pulse var(--duration) ease-out infinite'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
	plugin(function ({ addUtilities } : any) {
		addUtilities({
			'.heading-gradient': {
				'color': 'rgba(0, 0, 0, 0)',
				'-webkit-text-fill-color': 'transparent',
				'background-image': 'radial-gradient(circle farthest-side at 45%, #fff, rgba(255, 255, 255, .43))',
				'-webkit-background-clip': 'text',
				'background-clip': 'text',
				'padding-bottom': '5px'
			}
		})
	}),
	plugin(function ({ addUtilities }: any) {
		addUtilities({
			'.bg-noise': {
				backgroundImage: 'url("/textures/noise.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-chess': {
				backgroundImage: 'url("/textures/chess.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-crypto': {
				backgroundImage: 'url("/textures/crypto.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-dots': {
				backgroundImage: 'url("/textures/dots.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-lines': {
				backgroundImage: 'url("/textures/lines.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-metal': {
				backgroundImage: 'url("/textures/metal.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-pixels': {
				backgroundImage: 'url("/textures/pixels.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-retro': {
				backgroundImage: 'url("/textures/retro.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-stairs': {
				backgroundImage: 'url("/textures/stairs.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-twins': {
				backgroundImage: 'url("/textures/twins.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			'.bg-wave': {
				backgroundImage: 'url("/textures/wave.png")',

				backgroundSize: 'cover',
				backgroundBlendMode: 'overlay'
			},
			
		})
	})
  ],
} satisfies Config;
