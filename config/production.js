module.exports = {
  NODE_ENV: 'production',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRY_KEY: process.env.JWT_EXPIRY_KEY,
  TELEMETRY_URI: process.env.TELEMETRY_URI,
  TELEMETRY_SERVICE_NAME: process.env.TELEMETRY_SERVICE_NAME || 'marketplace-api',
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
    prefix: process.env.ELASTIC_INDEX_NAME_PREFIX,
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
    },
  },
  assetIndex: process.env.ASSET_INDEX,
}
