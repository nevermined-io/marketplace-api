import { Routes } from 'nest-router';
import { GreetingModule } from './greeting/greeting.module';

export const routes: Routes = [{
    path: '/greeting', module: GreetingModule
}];