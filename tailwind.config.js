/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0a0a0c',
                    secondary: '#141418',
                    tertiary: '#1c1c22',
                },
                accent: {
                    primary: '#7c5cfc',
                    secondary: '#00d4aa',
                    fat: '#ff6b8a',
                    carbs: '#ffb547',
                    protein: '#00d4aa',
                },
                text: {
                    primary: '#f0f0f5',
                    secondary: '#8e8e9a',
                }
            },
            animation: {
                'orb': 'orb-pulse 4s ease-in-out infinite',
            },
            keyframes: {
                'orb-pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.8, filter: 'blur(4px)' },
                    '50%': { transform: 'scale(1.05)', opacity: 1, filter: 'blur(8px)' },
                }
            }
        },
    },
    plugins: [],
}
