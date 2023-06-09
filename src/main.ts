import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { readFileSync } from 'fs'
import path from 'path'
import { ApplicationModule } from './app.module'
import { ConfigService } from './shared/config/config.service'
import { BookmarkService } from './bookmarks/bookmark.service'
import { UserProfileService } from './user-profiles/user-profile.service'
import { PermissionService } from './permissions/permission.service'
import { AssetService } from './assets/asset.service'
import { ServiceDDOService } from './assets/ddo-service.service'
import { DDOStatusService } from './assets/ddo-status.service'

const createIndexes = (app: NestExpressApplication) => {
  return new Promise<void>((resolve) => {
    let connectionTries = 0
    /* eslint @typescript-eslint/no-misused-promises: 0 */
    const tryConnectionInterval = setInterval(async () => {
      try {
        await Promise.all(
          [
            PermissionService,
            UserProfileService,
            BookmarkService,
            AssetService,
            ServiceDDOService,
            DDOStatusService,
          ].map(async (service) => {
            const serviceInstance = app.get(service)
            const serviceIndexExits = await serviceInstance.checkIndex()

            if (!serviceIndexExits) {
              await serviceInstance.createIndex()
            }
          }),
        )
        Logger.log('Marketplace API is connected to ElasticSearch')
        resolve()
        clearInterval(tryConnectionInterval)
      } catch {
        Logger.log('Error to connect to ElasticSearch. Trying in 10s')
        connectionTries += 1
        if (connectionTries >= 50) {
          clearInterval(tryConnectionInterval)
        }
      }
    }, 10000)
  })
}

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, {
    cors: true,
    logger:
      process.env.NODE_ENV !== 'production'
        ? ['error', 'log', 'warn', 'debug']
        : ['error', 'log', 'warn'],
  })
  app.enable('trust proxy')
  app.useGlobalPipes(new ValidationPipe())

  const PORT = app.get<ConfigService>(ConfigService).get<number>('server.port')

  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  const packageJsonString = readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonString) as { version: string }

  await createIndexes(app)

  const options = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setVersion(packageJson.version)
    .addBearerAuth(
      {
        type: 'http',
      },
      'Authorization',
    )
    .build()
  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('api/v1/docs', app, document)

  await app.listen(PORT)
  Logger.log({
    message: `server version ${packageJson.version} started!`,
    port: PORT,
    url: `http://localhost:${PORT}/api`,
  })
}

bootstrap().catch((reason) => Logger.error(reason))
