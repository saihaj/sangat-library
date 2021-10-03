module.exports = {
  src: './src',
  schema: '../graphql/schema.graphql',
  language: 'typescript',
  artifactDirectory: './src/relay-artifacts',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/relay-artifacts/**'],
}
