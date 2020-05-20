import { Tray } from "electron";
const path = require("path");

let nextIcon = path.join(__dirname, "bundled/img/tray-next.png");

let playIcon = path.join(__dirname, "bundled/img/tray-play.png");
let prevIcon = path.join(__dirname, "bundled/img/tray-prev.png");

let next, prev;

export default function() {
  next = new Tray(nextIcon);
  global.play = new Tray(playIcon);
  prev = new Tray(prevIcon);
  global.play.on("click", function() {
    global.win.webContents.send("control", { type: "play" });
  });
  next.on("click", function() {
    global.win.webContents.send("control", { type: "next" });
  });
  prev.on("click", function() {
    global.win.webContents.send("control", { type: "prev" });
  });
}
