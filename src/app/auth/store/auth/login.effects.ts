import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as AuthActions from './login.actions';
import { Auth } from '../../../core/auth/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private authService = inject(Auth);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ payload }) =>
        this.authService.login(payload).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              result: response,
              status: response.status,
            })
          ),
          catchError((error) => {
            // Extract backend error message safely
            const errorMessage =
              error?.error?.errorMessage || // backend returns "Invalid password."
              error?.error?.message ||
              error?.message ||
              'Login Failed';

            // Show toastr error
            this.toastr.error(errorMessage, 'Error');

            return of(
              AuthActions.loginFailure({
                error: errorMessage,
              })
            );
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ result }) => {
          if (result) {
            this.toastr.success('Login Successful!', 'Success');
            this.router.navigate(['simplesolve']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.toastr.info('You have been logged out', 'Info');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
