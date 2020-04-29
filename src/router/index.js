import Vue from "vue";
import VueRouter from "vue-router";
import Find from "../views/find";
import RankingList from "../views/find/ranking-list";
import SongSheet from "@/views/song/";
import SongSheetDetails from "@/views/song/song-sheet-details";
import BoutiqueSong from "@/views/song/boutique-song";
import MvDetails from "@/views/video/mv-details";
import Singer from "@/views/singer";
import RecommendMusic from "@/views/song/recommend-music";
import Login from "@/views/login/";
import Home from "@/views/home";
import NewMusic from "@/views/music/";
import SingerDetails from "@/views/singer/details";
import UserDetails from "@/views/user/user-details";
import Video from "@/views/video";
import Mv from "@/views/video/mv";
import MvRankAll from "@/views/video/mv-rank-all";
import MvAll from "@/views/video/mv-all";
import Search from "@/views/search";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    redirect: "find",
    children: [
      {
        path: "find",
        name: "find",
        component: Find
      },
      {
        path: "ranking-list",
        name: "rankingList",
        component: RankingList
      },
      {
        path: "song-sheet",
        name: "songSheet",
        component: SongSheet
      },
      {
        path: "song-sheet-details",
        name: "songSheetDetails",
        component: SongSheetDetails
      },
      {
        path: "boutique-song",
        name: "boutiqueSong",
        component: BoutiqueSong
      },
      {
        path: "recommend-music",
        name: "recommendMusic",
        component: RecommendMusic
      },
      {
        path: "singer",
        name: "singer",
        component: Singer
      },
      {
        path: "singer-details",
        name: "singerDetails",
        component: SingerDetails
      },
      {
        path: "new-music",
        name: "newMusic",
        component: NewMusic
      },
      {
        path: "user-details",
        name: "userDetails",
        component: UserDetails
      },
      {
        path: "video",
        name: "video",
        component: Video
      },
      {
        path: "mv",
        name: "mv",
        component: Mv
      },
      {
        path: "mvRankAll",
        name: "mvRankAll",
        component: MvRankAll
      },
      {
        path: "mvAll",
        name: "mvAll",
        component: MvAll
      },
      {
        path: "search",
        name: "search",
        component: Search
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/mvDetails",
    name: "mvDetails",
    component: MvDetails
  }
];

const router = new VueRouter({
  routes
});

export default router;
