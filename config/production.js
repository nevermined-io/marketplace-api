module.exports = {
  NODE_ENV: 'production',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRY_KEY: process.env.JWT_EXPIRY_KEY,
  API_VERSION: process.env.API_VERSION,
  server: {
    port: process.env.PORT || 3100,
  },
  src: {
    root: 'dist',
    fileExtension: 'js',
  },
  security: {
    enableHttpsRedirect: process.env.ENABLE_HTTPS_REDIRECT,
  },
  elasticsearch: {
    cloudId: process.env.ELASTIC_CLOUD_ID,
    prefix: process.env.ELASTIC_INDEX_NAME_PREFIX,
    auth: {
      apiKey: process.env.ELASTIC_API_KEY,
    },
  },
  assetIndex: process.env.ASSET_INDEX,
}
