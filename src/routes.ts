import { Routes } from 'nest-router';
import { BookmarkModule } from './bookmarks/bookmark.module';
import { AssetModule } from './assets/asset.module';
import { UserProfileModule } from './user-profiles/user-profile.module';

export const routes: Routes = [
  { path: '/api/v1/ugc/bookmarks', module: BookmarkModule },
  { path: '/api/v1/metadata/assets', module: AssetModule },
  { path: '/api/v1/metadata/profiles', module: UserProfileModule },
];
