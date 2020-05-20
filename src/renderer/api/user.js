import axios from "./axios";

// 手机登录
const loginCellphone = async function(data) {
  const res = await axios.get({
    url: "/login/cellphone",
    data
  });
  return res;
};

// 获取私人FM
const getPersonalFm = async function(data) {
  const res = await axios.get({
    // url: "/personal_fm?timestamp=" + new Date().getTime(),
    url: "/personal_fm",
    data
  });
  return res;
};

// 刷新登录状态
const loginRefresh = async function(data) {
  const res = await axios.get({
    url: "/login/refresh",
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
// 搜索
const search = async function(data) {
  const res = await axios.get({
    url: "/search",
    data
  });
  return res;
};
// 获取搜索热搜
const getSearchHot = async function(data) {
  const res = await axios.get({
    url: "/search/hot",
    data
  });
  return res;
};
// 获取搜索建议
const getSearchSuggest = async function(data) {
  const res = await axios.get({
    url: "/search/suggest",
    data
  });
  return res;
};
// 获取用户关注
const getUserFollows = async function(data) {
  const res = await axios.get({
    url: "/user/follows",
    data
  });
  return res;
};
// 获取用户粉丝
const getUserFolloweds = async function(data) {
  const res = await axios.get({
    url: "/user/followeds",
    data
  });
  return res;
};
// 获取用户动态
const getUserEvent = async function(data) {
  const res = await axios.get({
    url: "/user/event",
    data
  });
  return res;
};
// 获取动态
const getEvent = async function(data) {
  const res = await axios.get({
    url: "/event",
    data
  });
  return res;
};
// 获取动态评论
const getCommentEvent = async function(data) {
  const res = await axios.get({
    url: "/comment/event",
    data
  });
  return res;
};
// 获取热门话题
const getHotTopic = async function(data) {
  const res = await axios.get({
    url: "/hot/topic",
    data
  });
  return res;
};
export default {
  getUserDetail,
  getPersonalFm,
  loginRefresh,
  loginCellphone,
  getUserPlaylist,
  getUserLikelist,
  getUserRecord,
  getMsgProvate,
  getMsgComments,
  getMsgForwards,
  getMsgNotices,
  getSimiUser,
  search,
  getSearchHot,
  getSearchSuggest,
  getUserFollows,
  getUserFolloweds,
  getUserEvent,
  getEvent,
  getCommentEvent,
  getHotTopic
};
