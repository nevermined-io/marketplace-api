module.exports = {
  NODE_ENV: 'staging',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRY_KEY: process.env.JWT_EXPIRY_KEY,
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
    prefix: process.env.ELASTIC_PREFIX,
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
    },
  },
}
