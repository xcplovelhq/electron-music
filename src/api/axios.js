import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  responseType: "json"
});

export default {
  get(obj) {
    return Promise.resolve(
      instance({
        method: "GET",
        url: obj.url,
        params: obj.data
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
      })
    );
  }
};
