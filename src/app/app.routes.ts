import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'simplesolve',
    loadChildren: () =>
      import('./features/feature.routes').then((r) => r.FeatureRoutes),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
