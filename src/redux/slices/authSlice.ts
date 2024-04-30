import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request, { BASE_URL_MEDIA } from "~/services/axios";
import { setValueToLocalStorage } from "~/utils/contactWithLocalStorage";
import { RootState } from "../store";

interface IUserInfo{
    isLogin: boolean,
    logging: boolean,
    isError: boolean,
    loginError: {
        messageError: string,
        typeError: string,
    }
    userData?: IUser | null
}

export interface IErrorPayload{
    typeError: string,
    messageError: string,
}

export interface ILoginPayload{
    loginName?: string,
    password?: string
}

const initialUser: IUserInfo = {
    isLogin: false,
    logging: false,
    isError: false,
    loginError:{
        messageError: "",
        typeError:"",
    },
    
    // userData: JSON.parse(String(localStorage.getItem('user_data'))) || null, 
    userData: null, 
}
console.log(initialUser)

// --- Tạo thunk ---
export const refreshToken = createAsyncThunk(
    'task/addTask',
    async (data: {token:string, refresh_token:string}) => {
            const response:any = request.post(BASE_URL_MEDIA + '/api/Auth/refresh-token', 
                data.refresh_token, 
                {headers: {
                    'Authorization': `Bearer ${data.token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res:any)=>{
                const userData:IUser = res.returnObj;
        
                if(userData){
                    setValueToLocalStorage('access_token', userData.token)
                    setValueToLocalStorage('refresh_token',userData.refreshToken)
                }
                console.log(userData);
                return userData;
            }).catch((error)=>{
                console.log(error);
                localStorage.clear();

                return error
            })
            return response;
        }
  );

export const changeAvt = createAsyncThunk(
    'task/changeAvt',
    async (data: {userData:IUser}) => {
            return data.userData
        }
  );

const authSlice = createSlice({
    name: 'auth',
    initialState: initialUser,
    reducers: {
        login(state,action: PayloadAction<ILoginPayload>){
            state.logging = true
        },
        loginSucces(state, action: PayloadAction<IUser>){
            state.isLogin = true
            state.logging = false
            state.userData = action.payload
        },
        loginFailed(state, action: PayloadAction<IErrorPayload>){
            state.isLogin = false
            state.logging = false
            state.isError = true
            state.loginError.messageError = action.payload.messageError
            state.loginError.typeError = action.payload.typeError
            state.userData = undefined
        },
        logout(state){
            state.userData = undefined,
            state.loginError.messageError = ""
            state.loginError.typeError = ""
            state.logging = false
            state.isLogin = false
        }
    },
    extraReducers: (builder) => {
        // --- Xử lý trong reducer với case pending / fulfilled / rejected ---
         builder
           .addCase(refreshToken.pending, (state) => {
                state.logging = true
           })
           .addCase(refreshToken.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.logging = false
                if (action.payload) {
                    state.isLogin = true
                    state.userData = action.payload
                }
                else {
                    localStorage.clear();
                }
           })
           .addCase(refreshToken.rejected, (state) => {
                state.userData = undefined,
                state.loginError.messageError = ""
                state.loginError.typeError = ""
                state.logging = false
                state.isLogin = false
            })
            .addCase(changeAvt.fulfilled, (state, action:PayloadAction<IUser>) => {
                state.userData = action.payload
            });
       }
})

export const {login,logout,loginSucces,loginFailed} = authSlice.actions

export const isLogin = (state:RootState) => state.auth.isLogin
export const logging = (state:RootState) => state.auth.logging 
export const inforUser = (state:RootState) => state.auth.userData 
export const messageErrorLogin = (state:RootState) => state.auth.loginError.messageError 
export const isError = (state:RootState) => state.auth.isError


const authReducer = authSlice.reducer;
export default authReducer;