import {Request} from '../js/request';

export function login(parameter: any) {
  return Request.axiosInstance({
    url: 'https://tronclass.com.cn/api/login',
    method: 'post',
    data: parameter
  })
}
