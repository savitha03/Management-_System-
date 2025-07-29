export interface LoginState{
    result: any | null;
    status: string | null;
    loading: boolean;
    error:  string | null;
}

export const initialLoginState: LoginState ={
    result: null,
    status: null,
    loading: false,
    error: null,
};