import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';
import { ConfigService } from './shared/config/config.service';
import { Logger } from './shared/logger/logger.service';
import info from '../package.json';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, { cors: true, logger });
  app.enable('trust proxy');
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));

  const options = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setVersion(info.version)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const PORT = app.get<ConfigService>(ConfigService).get<number>('server.port');
  await app.listen(PORT);
  logger.log({ message: 'server started 🚀', port: PORT, url: `http://localhost:${PORT}/api` });
}

// tslint:disable-next-line:no-console
bootstrap().catch(reason => console.error(reason));