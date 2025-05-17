import { Routes } from '@angular/router';

import { UsersComponent } from './users/users/users.component';  

export const PAGES_ROUTE: Routes = [
  {
    path: 'users',
    component: UsersComponent,  
  },
];