/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
/* eslint @typescript-eslint/no-unsafe-argument: 0 */
import * as Joi from 'joi';
import { get as loGet } from 'lodash';
import { Logger } from '../logger/logger.service';

export interface EnvConfig {
  [key: string]: string;
}

const configProfile = require('../../../config');

const DOTENV_SCHEMA = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  JWT_SECRET_KEY: Joi.string().required().error(new Error('JWT_SECRET_KEY is required!')),
  API_VERSION: Joi.string().required().error(new Error('API_VERSION is required')),
  server: Joi.object({
    port: Joi.number().default(3000),
  }),
  elasticsearch: Joi.object({
    node: Joi.string().default('http://localhost:9200'),
    auth: Joi.object({
      username: Joi.string().required().error(new Error('CLUSTER_NAME is required!')),
      password: Joi.string().default('v1'),
    }).error(new Error('auth of elasticsearch need to be set')),
  })
    .required()
    .error(new Error('The config of elasticsearch need to be set')),
});

type DotenvSchemaKeys =
  | 'NODE_ENV'
  | 'API_VERSION'
  | 'server.port'
  | 'database.url'
  | 'JWT_SECRET_KEY'
  | 'security.enableHttpsRedirect'
  | 'elasticsearch.node'
  | 'elasticsearch.auth.username'
  | 'elasticsearch.auth.password';

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    this.envConfig = this.validateInput(configProfile);
  }

  get<T>(path: DotenvSchemaKeys): T | undefined {
    return loGet(this.envConfig, path) as unknown as T | undefined;
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = DOTENV_SCHEMA.validate(envConfig, {
      allowUnknown: true,
      stripUnknown: true,
    });
    if (error) {
      Logger.error('Missing configuration please provide followed variable!\n\n', 'ConfigService');
      Logger.error(error.message, 'ConfigService');
      process.exit(2);
    }
    return validatedEnvConfig as EnvConfig;
  }
}
