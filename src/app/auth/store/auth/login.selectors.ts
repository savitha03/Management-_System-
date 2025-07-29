import { createFeatureSelector, createSelector } from "@ngrx/store";
import {LoginState} from './login.state'

export const selectAuthState = createFeatureSelector<LoginState>('auth');

export const selectAuthUser = createSelector(
    selectAuthState,
    (state)=> state.result
);

export const selectAuthToken = createSelector(
    selectAuthState,
    (state)=>state.result
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state)=>state.loading
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state)=>state.error
);