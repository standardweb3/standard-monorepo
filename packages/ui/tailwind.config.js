const { on } = require('events');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    '../../packages/ui/components/**/*.{ts,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      0: '0px',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      xs: '380px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        teodor: ['Teodor', 'sans-serif'],
      },
      fontWeight: {
        regular: '350',
        medium: '500',
        semibold: '600',
        bold: '700',
        link: '500',
      },
      fontSize: {
        // Desktop Display
        dd1: ['72px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dd2: ['60px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dd3: ['48px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dd4: ['40px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        // Deskop Heading
        dh1: ['60px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dh2: ['48px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dh3: ['40px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dh4: ['32px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dh5: ['24px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        dh6: ['20px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        // Tablet Display
        td1: ['60px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        td2: ['48px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        td3: ['40px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        td4: ['32px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        // Tablet Heading
        th1: ['48px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        th2: ['40px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        th3: ['32px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        th4: ['28px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        th5: ['24px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        th6: ['20px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        // Mobile Display
        md1: ['48px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        md2: ['40px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        md3: ['32px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        md4: ['28px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        // Mobile Heading
        mh1: ['40px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        mh2: ['32px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        mh3: ['28px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        mh4: ['24px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        mh5: ['20px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        mh6: ['20px', { lineHeight: '1.2rem', letterSpacing: '-0.02rem' }],
        // Body
        'body-caption': [
          '12px',
          { lineHeight: '1.5rem', letterSpacing: '0rem' },
        ],
        'body-default': [
          '16px',
          { lineHeight: '1.5rem', letterSpacing: '0rem' },
        ],
        'body-lg': ['20px', { lineHeight: '1.5rem', letterSpacing: '0rem' }],
        'body-xl': ['24px', { lineHeight: '1.5rem', letterSpacing: '0rem' }],
      },
      height: {
        screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
      },
      colors: {
        onactionprimary: '#FFFFFF',
        onactionsecondary: '#050505',
        themedisabled: '#333333',
        themeprimary: {
          100: '#FFBFC0',
          200: '#FF8082',
          300: '#FF3D40',
          400: '#FF0004',
          500: '#BF0003',
          600: '#7F0002',
          700: '#400001',
          800: '#140000',
          DEFAULT: '#FF0004',
        },
        themeerror: {
          100: '#FFBFC0',
          200: '#FF8082',
          300: '#FF3D40',
          400: '#FF0004',
          500: '#BF0003',
          600: '#7F0002',
          700: '#400001',
          800: '#140000',
          DEFAULT: '#FF0004',
        },
        themesuccess: {
          100: '#C1E0D3',
          200: '#84C2A8',
          300: '#47A47D',
          400: '#098551',
          500: '#07643D',
          600: '#044228',
          700: '#022114',
          800: '#010B06',
          DEFAULT: '#098551',
        },
        themewarning: {
          100: '#FFD7BF',
          200: '#FFB180',
          300: '#FF8940',
          400: '#FF6200',
          500: '#BF4900',
          600: '#7F3100',
          700: '#401800',
          800: '#140800',
          DEFAULT: '#FF6200',
        },
        red: {
          100: '#FFBFC0',
          200: '#FF8082',
          300: '#FF3D40',
          400: '#FF0004',
          500: '#BF0003',
          600: '#7F0002',
          700: '#400001',
          800: '#140000',
          DEFAULT: '#FF0004',
        },
        'neon-green': {
          100: '#F2FFBF',
          200: '#E6FF80',
          300: '#D9FF40',
          400: '#CCFF00',
          500: '#99BF00',
          600: '#667F00',
          700: '#334000',
          800: '#0C0F00',
          DEFAULT: '#CCFF00',
        },
        green: {
          100: '#C1E0D3',
          200: '#84C2A8',
          300: '#47A47D',
          400: '#098551',
          500: '#07643D',
          600: '#044228',
          700: '#022114',
          800: '#010B06',
          DEFAULT: '#098551',
        },
        orange: {
          100: '#FFD7BF',
          200: '#FFB180',
          300: '#FF8940',
          400: '#FF6200',
          500: '#BF4900',
          600: '#7F3100',
          700: '#401800',
          800: '#140800',
          DEFAULT: '#FF6200',
        },
        black: {
          100: '#999999',
          200: '#666666',
          300: '#333333',
          400: '#292929',
          500: '#1F1F1F',
          600: '#141414',
          700: '#0A0A0A',
          800: '#050505',
          DEFAULT: '#050505',
          dark12: 'rgba(5, 5, 5, 0.12)',
        },
        white: {
          DEFAULT: '#FFFFFF',
          100: '#FFFFFF',
          200: '#ECEFF1',
          300: '#D0D7DC',
          400: '#B3BEC7',
          light12: 'rgba(255, 255, 255, 0.12)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        flip: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        rotate: {
          to: {
            transform: 'rotate(90deg)',
          },
        },
        dripping: {
          to: {
            transform: 'translateY(300px)',
          },
        },
        'background-shine': {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
        'infinite-slider': {
          '0%': { transform: 'translateX(0)' },
          '100%': {
            transform: 'translateX(calc(-250px * 5))',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        flip: 'flip 6s infinite steps(2, end)',
        rotate: 'rotate 3s linear infinite both',
        dripping: 'dripping 6s linear infinite',
        'background-shine': 'background-shine 2s linear infinite',
        'infinite-slider': 'infinite-slider 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
