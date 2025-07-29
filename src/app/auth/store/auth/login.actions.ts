import { createAction, props } from "@ngrx/store";


export const login = createAction(
    '[Auth] Login',
    props<{payload: { empCode: string; password: string }}>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{result:any,status:string}>()
);

export const loginFailure =  createAction(
    '[Auth] Login Failure',
    props<{error:string}>()
);