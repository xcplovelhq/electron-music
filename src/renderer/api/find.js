import axios from "./axios";

// 获取banner
const getBanner = async function() {
  const res = await axios.get({
    url: "/banner"
  });
  return res;
};
// 获取推荐歌单
const getPersonalized = async function() {
  const res = await axios.get({
    url: "/personalized"
  });

  return res;
};
// 获取每日推荐歌单
const getRecommendResource = async function() {
  const res = await axios.get({
    url: "/recommend/resource"
  });
  return res;
};

// 获取主播电台
const getDjprogram = async function() {
  const res = await axios.get({
    url: "/personalized/djprogram"
  });
  return res;
};
// 获取所有榜单内容摘要
const getToplistDetail = async function() {
  const res = await axios.get({
    url: "/toplist/detail"
  });
  return res;
};
// 获取新音乐
const getPersonalizedNewsong = async function() {
  const res = await axios.get({
    url: "/personalized/newsong"
  });
  return res;
};
// 获取MV
const getPersonalizedMv = async function() {
  const res = await axios.get({
    url: "/personalized/mv"
  });
  return res;
};
// 获取电台
const getPersonalizedDjprogram = async function() {
  const res = await axios.get({
    url: "/personalized/djprogram"
  });
  return res;
};
// 获取排行榜
const getTopList = async function(data) {
  const res = await axios.get({
    url: "/top/list",
    data
  });
  return res;
};
// 获取所有排行榜
const getAllTopList = async function(data) {
  const res = await axios.get({
    url: "/toplist",
    data
  });
  return res;
};

export default {
  getBanner,
  getPersonalized,
  getRecommendResource,
  getDjprogram,
  getToplistDetail,
  getPersonalizedNewsong,
  getPersonalizedMv,
  getPersonalizedDjprogram,
  getTopList,
  getAllTopList
};
