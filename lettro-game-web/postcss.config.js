// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ à la place de 'tailwindcss': {}
    autoprefixer: {},
  },
}
