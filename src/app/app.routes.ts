import { Routes } from '@angular/router';
import { AuthGuard } from 'src/assets/auth/auth.guard';

export const rootRoutes: Routes = [
  { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] }
];
