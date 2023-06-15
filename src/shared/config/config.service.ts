/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
/* eslint @typescript-eslint/no-unsafe-argument: 0 */
import { Logger } from '@nestjs/common'
import * as Joi from 'joi'
import { get as loGet } from 'lodash'

export interface EnvConfig {
  [key: string]: string
}

const configProfile = require('../../../config')

const DOTENV_SCHEMA = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  JWT_SECRET_KEY: Joi.string().required().error(new Error('JWT_SECRET_KEY is required!')),
  JWT_EXPIRY_KEY: Joi.string().default('60m'),
  server: Joi.object({
    port: Joi.number().default(3000),
  }),
  security: Joi.object({
    enableHttpsRedirect: Joi.bool().default(false),
  }).default({
    enableHttpsRedirect: false,
  }),
  elasticsearch: Joi.object({
    node: Joi.string().default('https://localhost:9200'),
    prefix: Joi.string().required().error(new Error('ELASTIC_INDEX_NAME_PREFIX is required!')),
    auth: Joi.object({
      username: Joi.string().required().error(new Error('CLUSTER_NAME is required!')),
      password: Joi.string(),
    }).error(new Error('auth of elasticsearch need to be set')),
  })
    .required()
    .error(new Error('The config of elasticsearch need to be set')),
})

type DotenvSchemaKeys =
  | 'NODE_ENV'
  | 'server.port'
  | 'database.url'
  | 'JWT_SECRET_KEY'
  | 'JWT_EXPIRY_KEY'
  | 'security.enableHttpsRedirect'
  | 'elasticsearch.node'
  | 'elasticsearch.prefix'
  | 'elasticsearch.auth.username'
  | 'elasticsearch.auth.password'

export class ConfigService {
  private readonly envConfig: EnvConfig

  constructor() {
    this.envConfig = this.validateInput(configProfile)
  }

  get<T>(path: DotenvSchemaKeys): T | undefined {
    return loGet(this.envConfig, path) as unknown as T | undefined
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = DOTENV_SCHEMA.validate(envConfig, {
      allowUnknown: true,
      stripUnknown: true,
    })
    if (error) {
      Logger.error('Missing configuration please provide followed variable!\n\n', 'ConfigService')
      Logger.error(error.message, 'ConfigService')
      process.exit(2)
    }
    return validatedEnvConfig as EnvConfig
  }
}
