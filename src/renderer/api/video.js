import axios from "./axios";
// 获取视频标签列表
const getVideoGroupList = async function(data) {
  const res = await axios.get({
    url: "/video/group/list",
    data
  });
  return res;
};
// 获取视频标签下的视频
const getVideoGroup = async function(data) {
  const res = await axios.get({
    url: "/video/group",
    data
  });
  return res;
};
// 获取全部 mv
const getMvAll = async function(data) {
  const res = await axios.get({
    url: "/mv/all",
    data
  });
  return res;
};
// 获取最新 mv
const getMvFirst = async function(data) {
  const res = await axios.get({
    url: "/mv/first",
    data
  });
  return res;
};
// 获取网易出品 mv
const getMvExclusiveRcmd = async function(data) {
  const res = await axios.get({
    url: "/mv/exclusive/rcmd",
    data
  });
  return res;
};
// 获取推荐 mv
const getPersonalizedMv = async function(data) {
  const res = await axios.get({
    url: "/personalized/mv",
    data
  });
  return res;
};
// 获取mv排行榜
const getTopMv = async function(data) {
  const res = await axios.get({
    url: "/top/mv",
    data
  });
  return res;
};
// 获取mv详情
const getMvDetails = async function(data) {
  const res = await axios.get({
    url: "/mv/detail",
    data
  });
  return res;
};
// 获取mv地址
const getMvUrl = async function(data) {
  const res = await axios.get({
    url: "/mv/url",
    data
  });
  return res;
};

// 获取相似mv
const getSimiMv = async function(data) {
  const res = await axios.get({
    url: "/simi/mv",
    data
  });
  return res;
};
// 获取视频详情
const getVideoDetail = async function(data) {
  const res = await axios.get({
    url: "/video/detail",
    data
  });
  return res;
};
// 获取视频地址
const getVideoUrl = async function(data) {
  const res = await axios.get({
    url: "/video/url",
    data
  });
  return res;
};
// 获取相关视频
const getRelatedAllvideo = async function(data) {
  const res = await axios.get({
    url: "/related/allvideo",
    data
  });
  return res;
};
// 获取Mv评论
const getCommentMv = async function(data) {
  const res = await axios.get({
    url: "/comment/mv",
    data
  });
  return res;
};
// 获取视频评论
const getCommentVideo = async function(data) {
  const res = await axios.get({
    url: "/comment/video",
    data
  });
  return res;
};
export default {
  getVideoGroupList,
  getVideoGroup,
  getMvAll,
  getMvFirst,
  getMvExclusiveRcmd,
  getPersonalizedMv,
  getTopMv,
  getMvDetails,
  getMvUrl,
  getSimiMv,
  getVideoDetail,
  getVideoUrl,
  getRelatedAllvideo,
  getCommentMv,
  getCommentVideo
};
