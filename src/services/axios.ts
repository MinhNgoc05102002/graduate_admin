import axios, { AxiosResponse } from 'axios';
import { IResponse } from '~/types/IResponse';
export const BASE_URL_MEDIA = 'https://localhost:7274'

const request = axios.create({
    baseURL: BASE_URL_MEDIA,
});

// Add a request interceptor
// request.interceptors.request.use(function (config) {
//     console.log(config,"ádkasdlas")
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// Add a request interceptor
request.interceptors.request.use(function (config) {
  const token = String(localStorage.getItem("access_token"));
  config.headers.Authorization = "Bearer " + token;
  // config.headers["Content-Type"] = "application/json";

  // config.headers["Content-Type"] = "multipart/form-data";
  
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default request

// NGOCNM: phần tự viết thêm để nhét token vào header (lấy từ project mxh cũ)
// export const Get = async (path:string, options = {},token:string) => {
//     const res:IResponse = await request.get(path,{
//         ...options,
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     return res
// }

// export const Post = async (path:string, options:any = {},token:string) => {
//   const res:IResponse = await request.post(path, options,
//     {
//       headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//       }
//     });
//   return res   
// }


export const Get = async (path:string, options = {}) => {
  const res:IResponse = await request.get(path,{
      ...options,
  });
  return res
}

export const Post = async (path:string, options:any = {}, headers:any = {}) => {
    const res:IResponse = await request.post(path, options, {
      ...headers
    });
    return res   
}

// END NGOCNM
