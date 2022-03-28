import { Routes } from 'nest-router';
import { BookmarkModule } from './bookmarks/bookmark.module';
import { AssetModule } from './assets/asset.module';

export const routes: Routes = [
    { path: '/api/v1/ugc/bookmarks', module: BookmarkModule },
    { path: '/api/v1/metadata/assets', module: AssetModule },
];
