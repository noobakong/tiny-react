import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  rules: {
    'ts/ban-ts-comment': 'off',
    'no-console': 'off',
    'style/brace-style': 'off',
    'curly': 'off',
  },
})
