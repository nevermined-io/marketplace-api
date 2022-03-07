const { parseKafkaBrokers } = require('./config');

module.exports = {
  NODE_ENV: 'production',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  server: {
    port: process.env.PORT || 3000,
  },
  src: {
    root: 'dist',
    fileExtension: 'js',
  },
  security: {
    enableHttpsRedirect: true,
  },
};
