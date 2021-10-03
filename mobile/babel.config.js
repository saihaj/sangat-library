module.exports = function (api) {
  api.cache(true)
  return {
    plugins: [['relay', { artifactDirectory: './src/relay-artifacts' }]],
    presets: ['babel-preset-expo'],
  }
}
