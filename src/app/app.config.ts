import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { loginReducer } from './auth/store/auth/login.reducer';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { LoginEffects } from './auth/store/auth/login.effects';

import { localStorageSync } from 'ngrx-store-localstorage';
import { MetaReducer } from '@ngrx/store';

// ✅ Step 1: Create meta-reducer
export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({
    keys: ['auth'],     // <-- state slices to persist
    rehydrate: true,    // <-- pull from localStorage on load
  })(reducer);
}

const metaReducers: MetaReducer[] = [localStorageSyncReducer];

// ✅ Step 2: Include metaReducers in provideStore()
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(
      { auth: loginReducer },
      {
        metaReducers,
      }
    ),
    provideEffects([LoginEffects]),
    provideStoreDevtools(),
  ],
};
