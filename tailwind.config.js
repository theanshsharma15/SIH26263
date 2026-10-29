/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0B2A5B',
            50: '#F0F4FA',
            100: '#E1E9F5',
            200: '#B8CBEA',
            300: '#8EADDF',
            400: '#4D7EC9',
            500: '#0B2A5B', // Primary Brand Deep Navy
            600: '#09234C',
            700: '#071A3B',
            800: '#05132A',
            900: '#030A17',
          },
          saffron: {
            DEFAULT: '#FF9933',
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
            300: '#FDBA74',
            400: '#FB923C',
            500: '#FF9933', // India Saffron
            600: '#EA580C',
            700: '#C2410C',
          },
          green: {
            DEFAULT: '#138808',
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            500: '#138808', // India Green
            600: '#15803D',
            700: '#166534',
          },
          ash: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(11, 42, 91, 0.08), 0 1px 3px -1px rgba(11, 42, 91, 0.04)',
        'elevated': '0 10px 25px -3px rgba(11, 42, 91, 0.12), 0 4px 6px -2px rgba(11, 42, 91, 0.05)',
      }
    },
  },
  plugins: [],
}
