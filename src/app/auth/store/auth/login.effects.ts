import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as AuthActions from './login.actions';
import { Auth } from '../../../core/auth/auth';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private authService = inject(Auth);

private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ payload }) =>
        this.authService.login(payload).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              result: response.result,
              status: response.status,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.message || 'Login Failed',
              })
            )
          )
        )
      )
    )
  );

  loginSucces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ result, status }) => {
        if (result) {
            this.router.navigate(['simplesolve']);
        }
      })
    ),
    { dispatch: false }
  );

  
}
