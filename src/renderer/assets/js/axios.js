// import axios from 'axios'
// import qs from 'qs'
//
// axios.defaults.baseURL = 'https://tronclass.com.cn'
//
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.timeout = 10000;
//
// axios.interceptors.request.use(
//   config => {
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// );
//
// axios.interceptors.response.use(
//   // response => {
//   //   if (response.status === 200) {
//   //     return Promise.resolve(response);
//   //   } else {
//   //     return Promise.reject(response);
//   //   }
//   // },
//   // error => {
//   //   console.log('err occurred', error);
//   // }
//   response => response,
//   error => {
//     console.log('err' + error)// for debug
//     console.log({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// );
//
// export default {
//   post(url, data) {
//     return new Promise((resolve, reject) => {
//
//       console.log("url is ", url);
//       console.log("before post, the data are", data, JSON.stringify(data));
//
//       axios({
//         method: 'post',
//         url,
//         data: JSON.stringify(data),
//       })
//         .then(res => {
//
//           console.log("post res is", res);
//
//           resolve(res.data)
//         })
//         .catch(err => {
//
//           console.log("post err is", err)
//
//           reject(err)
//         });
//     })
//   },
//
//   get(url, data) {
//     return new Promise((resolve, reject) => {
//       axios({
//         method: 'get',
//         url,
//         params: data,
//       })
//         .then(res => {
//           resolve(res.data)
//         })
//         .catch(err => {
//           reject(err)
//         })
//     })
//   }
// };


// import axios from 'axios'
// // import { Message } from 'element-ui'
// // import store from '@/store'
// // import { getToken } from '@/utils/auth'
//
// // 创建axios实例
// const service = axios.create({
//   baseURL: 'https://tronclass.com.cn',
//   timeout: 5000
// })
//
// // request拦截器
// service.interceptors.request.use(config => {
//   // Do something before request is sent
//   // if (store.getters.token) {
//   //   config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
//   // }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })
//
// // respone拦截器
// service.interceptors.response.use(
//   response => response,
//   error => {
//     console.log('err' + error)// for debug
//     console.log({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   })
//
// export default service
//
//
// // import request from '@/utils/request'
// //
// // //使用
// // export function getInfo(params) {
// //   return request({
// //     url: '/user/info',
// //     method: 'get',
// //     params
// //   });
// // }




import axios from 'axios'
// import {ACCESS_TOKEN} from '@/store/mutation-types'

// 创建 axios 实例
const requests = axios.create({
  // baseURL: process.env.VUE_APP_API, // 基础url,如果是多环境配置这样写，也可以像下面一行的写死。
  baseURL: 'http://127.0.0.1',
  timeout: 6000 // 请求超时时间
})

// 错误处理函数
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
        console.log({ type: 'danger', message: data.message||data.msg });
    }
    if (error.response.status === 401) {
        console.log({ type: 'danger', message: '你没有权限。' });
      // if (token) {
      //   store.dispatch('Logout').then(() => {
      //     setTimeout(() => {
      //       window.location.reload()
      //     }, 1500)
      //   })
      // }
    }
  }
  return Promise.reject(error)
}

// request interceptor(请求拦截器)
requests.interceptors.request.use(config => {
//   const token = Vue.ls.get(ACCESS_TOKEN)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor（接收拦截器）
requests.interceptors.response.use((response) => {
  const res = response.data
  if (res.code !== 0&&res.code!==200) {
    console.log({ type: 'danger', message: res.message||res.msg });
    // 401:未登录;
    if (res.code === 401||res.code === 403||res.code===999) {
      console.log({ type: 'danger', message: '请登录'});
    }
    return Promise.reject('error')
  } else {
    return res
  }
}, err)

export default {
  requests
}
