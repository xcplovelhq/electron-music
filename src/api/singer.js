import axios from "./axios";

// 获取歌手分类列表
const getArtistList = async function(data) {
  const res = await axios.get({
    url: "/artist/list",
    data
  });
  return res;
};
// 获取歌手单曲
const getArtists = async function(data) {
  const res = await axios.get({
    url: "/artists",
    data
  });
  return res;
};
// 获取歌手MV
const getArtistMv = async function(data) {
  const res = await axios.get({
    url: "/artist/mv",
    data
  });
  return res;
};
// 获取歌手专辑
const getArtistAlbum = async function(data) {
  const res = await axios.get({
    url: "/artist/album",
    data
  });
  return res;
};
// 获取歌手描述
const getArtistDesc = async function(data) {
  const res = await axios.get({
    url: "/artist/desc",
    data
  });
  return res;
};
// 获取相似歌手
const getSimiArtist = async function(data) {
  const res = await axios.get({
    url: "/simi/artist",
    data
  });
  return res;
};
export default {
  getArtistList,
  getArtists,
  getArtistMv,
  getArtistAlbum,
  getArtistDesc,
  getSimiArtist
};
