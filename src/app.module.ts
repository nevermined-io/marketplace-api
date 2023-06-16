import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { routes } from './routes'
import { ConfigModule } from './shared/config/config.module'
import { LoggerModule } from './shared/logger/logger.module'
import { InfoModule } from './info/info.module'
import { BookmarkModule } from './bookmarks/bookmark.module'
import { PermissionModule } from './permissions/permission.module'
import { AssetModule } from './assets/asset.module'
import { UserProfileModule } from './user-profiles/user-profile.module'
import { HttpsRedirectMiddleware } from './common/middlewares/https-redirection/https-redirection.middleware'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards/auth/jwt-auth.guard'
import { RolesGuard } from './common/guards/auth/roles.guards'

@Module({
  imports: [
    RouterModule.register(routes),
    AssetModule,
    LoggerModule,
    ConfigModule,
    InfoModule,
    BookmarkModule,
    UserProfileModule,
    AuthModule,
    PermissionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
