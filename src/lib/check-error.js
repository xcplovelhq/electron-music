// import { showError } from "./util";

export default function(res) {
  if (res.status === 200 && res.data.code === 200) {
    return true;
  } else if (res.status === 301) {
    // 没有登录
  }
}
