/** @type {import('tailwindcss').Config} */
export default {
  // ...existing config...
  theme: {
    extend: {
      // ...existing extensions...
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  // ...existing config...
}
