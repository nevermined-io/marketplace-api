import { Routes } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmarks/bookmark.module';

export const routes: Routes = [
    { path: '/api/v1/ugc/bookmarks', module: BookmarkModule },
    { path: '/api/v1/auth', module: AuthModule },
];