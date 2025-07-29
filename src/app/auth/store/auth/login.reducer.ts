import { createReducer, on } from "@ngrx/store";
import { initialLoginState } from "./login.state";
import * as AuthActions from './login.actions';

export const  loginReducer = createReducer(
    initialLoginState,

    on(AuthActions.login,(state)=>({
        ...state,
        loading:true,
        error:null
    })),

    on(AuthActions.loginSuccess,(state,{result,status})=>({
        ...state,
        result,
        status,
        loading:false
    })),

    on(AuthActions.loginFailure,(state,{error})=>({
        ...state,
        error,
        loading:false
    }))
);