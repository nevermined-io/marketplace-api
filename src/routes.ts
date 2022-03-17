import { Routes } from 'nest-router';
import { BookmarkModule } from './bookmarks/bookmark.module';

export const routes: Routes = [
    { path: '/api/v1/ugc/bookmarks', module: BookmarkModule },
];