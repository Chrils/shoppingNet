import axios from 'axios'

export function request(config){
  //1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:9999/shoppingnet_backend/',
    timeout: 5000
  })
  //2.发送网络请求
  return instance(config)
}
