import { AuthModule } from './auth/auth.module'
import { BookmarkModule } from './bookmarks/bookmark.module'
import { AssetModule } from './assets/asset.module'
import { UserProfileModule } from './user-profiles/user-profile.module'
import { PermissionModule } from './permissions/permission.module'
import { InfoModule } from './info/info.module'

export const routes = [
  { path: '/api/v1/ugc/bookmarks', module: BookmarkModule },
  { path: '/api/v1/metadata/assets', module: AssetModule },
  { path: '/api/v1/metadata/profiles', module: UserProfileModule },
  { path: '/api/v1/auth', module: AuthModule },
  { path: '/api/v1/permissions', module: PermissionModule },
  { path: '/', module: InfoModule },
]
