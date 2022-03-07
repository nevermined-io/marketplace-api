const { isEmpty } = require('lodash');

const parseKafkaBrokers = defaultBrokers =>
  (process.env.KAFKA_BROKERS || '')
    .split(',')
    .map(s => s.trim())
    .filter(b => !isEmpty(b)) || defaultBrokers;

module.exports = {
  parseKafkaBrokers,
};