import axios from "./axios";

// 获取新碟上架
const getTopAlbum = async function(data) {
  const res = await axios.get({
    url: "/top/album",
    data
  });

  return res;
};

// 获取专辑内容
const getAlbum = async function(data) {
  const res = await axios.get({
    url: "/album",
    data
  });
  return res;
};
// 专辑动态信息
const getAlbumDetailDynamic = async function(data) {
  const res = await axios.get({
    url: "/album/detail/dynamic",
    data
  });
  return res;
};
// 获取专辑评论
const getCommentAlbum = async function(data) {
  const res = await axios.get({
    url: "/comment/album",
    data
  });
  return res;
};

export default {
  getTopAlbum,
  getAlbum,
  getAlbumDetailDynamic,
  getCommentAlbum
};
