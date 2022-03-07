
  
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from './shared/config/config.module';
import { LoggerModule } from './shared/logger/logger.module';
import { GreetingModule } from './greeting/greeting.module';
import { HttpsRedirectMiddleware } from './common/middlewares/https-redirection/https-redirection.middleware';
import { routes } from './routes';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    LoggerModule,
    ConfigModule,
    GreetingModule,
  ],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}