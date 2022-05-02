import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { ConfigModule } from './shared/config/config.module';
import { LoggerModule } from './shared/logger/logger.module';
import { BookmarkModule } from './bookmarks/bookmark.module';
import { PermissionModule } from './permissions/permission.module';
import { AssetModule } from './assets/asset.module';
import { UserProfileModule } from './user-profiles/user-profile.module';
import { HttpsRedirectMiddleware } from './common/middlewares/https-redirection/https-redirection.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AssetModule,
    LoggerModule,
    ConfigModule,
    BookmarkModule,
    UserProfileModule,
    AuthModule,
    PermissionModule,
  ],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
