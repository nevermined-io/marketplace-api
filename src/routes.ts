import { Routes } from 'nest-router';
import { BookmarkModule } from './bookmarks/bookmark.module';
import { GreetingModule } from './greeting/greeting.module';

export const routes: Routes = [
    { path: '/api/v1/ugc/bookmarks', module: BookmarkModule },
    { path: '/api/v1/greeting', module: GreetingModule }
];