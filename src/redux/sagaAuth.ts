import { PayloadAction } from '@reduxjs/toolkit';
import { call, fork, put, take } from 'redux-saga/effects';
import { ILoginPayload, login, loginFailed, loginSucces, logout } from './slices/authSlice';
import axios, { AxiosResponse } from 'axios'; // Import AxiosResponse
import { BASE_URL_MEDIA } from '~/services/axios';
import { setValueToLocalStorage } from '~/utils/contactWithLocalStorage';
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* logger(action: PayloadAction) {
  console.log('log_saga', action);
}

const fetchApiAuth = async (payload: ILoginPayload): Promise<AxiosResponse> => {
  const response = await axios.post(BASE_URL_MEDIA + '/api/Auth/login', { ...payload });
  return response;
};

function* handleLogin(payload: ILoginPayload) {
  try {
    const response: AxiosResponse = yield call(fetchApiAuth, payload);
    const dataRes = response.data;
    console.log(response)
    if(dataRes?.returnObj && dataRes?.success == true){
      const dataUser: IUser = {
        ...dataRes.returnObj
      };
      yield put(loginSucces(dataUser));
      if(dataUser.token){
          setValueToLocalStorage('access_token',dataUser.token)
          setValueToLocalStorage('refresh_token',dataUser.refreshToken)
        }
    }else{
      // nhận dữ liệu trả về ở đây r show lỗi lên ... (truyền vào trong hàm login fail)
      yield put(loginFailed({
        typeError: "username",
        messageError: dataRes.msg
      }));
    }

  } catch (error: any) {
        // Handle error if needed
        yield put(loginFailed({
          typeError: "Error System",
          messageError: error.message
        }));
    console.error('Error in handleLogin:', error);
  }
}

function* handleLogout() {
  console.log('handle_logout');
  localStorage.removeItem('access_token');
}

function* watchFlow() {
  while (true) {
    const isLogin = Boolean(localStorage.getItem('access_token'));
    if (!isLogin) {
      const action: PayloadAction<ILoginPayload> = yield take(login.type);
      yield call(handleLogin, action.payload);
      continue;
    }

    yield take(logout.type);
    yield call(handleLogout);
  }
}

function* authSaga() {
  //   yield takeEvery('*', logger)
  yield fork(watchFlow);
}

export default authSaga;
