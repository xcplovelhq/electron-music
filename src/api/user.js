import axios from "./axios";

// 手机登录
const loginCellphone = async function(data) {
  const res = await axios.get({
    url: "/login/cellphone",
    data
  });
  return res;
};
// 获取用户详情
const getUserDetail = async function(data) {
  const res = await axios.get({
    url: "/user/detail",
    data
  });
  return res;
};
// 获取用户歌单
const getUserPlaylist = async function(data) {
  const res = await axios.get({
    url: "/user/playlist",
    data
  });
  return res;
};
// 获取用户喜欢音乐列表
const getUserLikelist = async function(data) {
  const res = await axios.get({
    url: "/likelist",
    data
  });
  return res;
};
// 获取用户播放记录
const getUserRecord = async function(data) {
  const res = await axios.get({
    url: "/user/record",
    data
  });
  return res;
};
// 获取用户通知-私信
const getMsgProvate = async function(data) {
  const res = await axios.get({
    url: "/msg/private",
    data
  });
  return res;
};
// 获取用户通知-评论
const getMsgComments = async function(data) {
  const res = await axios.get({
    url: "/msg/comments",
    data
  });
  return res;
};
// 获取用户通知-@我
const getMsgForwards = async function(data) {
  const res = await axios.get({
    url: "/msg/forwards",
    data
  });
  return res;
};
// 获取用户通知-通知
const getMsgNotices = async function(data) {
  const res = await axios.get({
    url: "/msg/notices",
    data
  });
  return res;
};

// 获取相似音乐用户
const getSimiUser = async function(data) {
  const res = await axios.get({
    url: "/simi/user",
    data
  });
  return res;
};
export default {
  getUserDetail,
  loginCellphone,
  getUserPlaylist,
  getUserLikelist,
  getUserRecord,
  getMsgProvate,
  getMsgComments,
  getMsgForwards,
  getMsgNotices,
  getSimiUser
};
