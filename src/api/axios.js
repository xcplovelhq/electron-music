import axios from "axios";
import store from "../store";
import { getStorage, deleteStorage } from "../lib/store";
const instance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  responseType: "json"
});
// 添加请求拦截器

instance.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    // 需要登录
    if (error.response.status === 301) {
      if (getStorage("userInfo")) {
        deleteStorage("userInfo");
        deleteStorage("likeSongSheet");
        store.commit("SET_USER_INFO", {});
        store.commit("GET_USER_SONG_SHEET", []);
      }
    }
    return Promise.reject(error);
  }
);

export default {
  get(obj) {
    return Promise.resolve(
      instance({
        method: "GET",
        url: obj.url,
        params: obj.data
      }).catch(err => {
        return err.response;
      })
    );
  },
  post(obj) {
    return Promise.resolve(
      instance({
        method: "POST",
        url: obj.url,
        responseType: "json",
        params: obj.data
      }).catch(err => {
        return err.response;
      })
    );
  }
};
