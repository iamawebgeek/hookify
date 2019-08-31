module.exports = {
  hooks: {
    'pre-commit': 'pretty-quick --staged --pattern "**/*.*(ts|tsx)"',
  },
}
