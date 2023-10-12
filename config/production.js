module.exports = {
  NODE_ENV: 'production',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRY_KEY: process.env.JWT_EXPIRY_KEY,
  WEB3_PROVIDER_URI: process.env.WEB3_PROVIDER_URI,
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
    node: process.env.ELASTIC_NODE,
    cloudId: process.env.ELASTIC_CLOUD_ID,
    prefix: process.env.ELASTIC_INDEX_NAME_PREFIX,
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
      apiKey: process.env.ELASTIC_API_KEY,
    },
  },
  assetIndex: process.env.ASSET_INDEX,
}
