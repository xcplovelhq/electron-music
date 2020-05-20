import { ipcMain, shell } from "electron";
const path = require("path");

let playIcon = path.join(__dirname, "bundled/img/tray-play.png");
let suspendIcon = path.join(__dirname, "bundled/img/tray-suspend.png");
export default function() {
  ipcMain.on("openWin", () => {
    global.loginModel.show();
  });
  ipcMain.on("changeMini", () => {
    if (global.win.isVisible()) {
      global.miniModel.show();
      global.win.hide();
    } else {
      global.miniModel.hide();
      global.win.show();
    }
  });
  ipcMain.on("setLyric", (e, data) => {
    if (data) {
      global.lyricModel.show();
    } else {
      global.lyricModel.hide();
    }
  });

  ipcMain.on("login", () => {
    global.loginModel.close();
  });
  ipcMain.on("closeWin", () => {
    global.loginModel.close();
  });
  ipcMain.on("setUserInfo", (e, data) => {
    global.win.webContents.send("setUserInfoData", data);
  });
  ipcMain.on("openUrl", (e, data) => {
    shell.openExternal(data);
  });
  ipcMain.on("control", (e, data) => {
    global.win.webContents.send("control", data);
  });
  ipcMain.on("getControl", (e, data) => {
    if (data.data) {
      global.play.setImage(playIcon);
    } else {
      global.play.setImage(suspendIcon);
    }
  });
  ipcMain.on("setMiniInfo", (e, data) => {
    global.miniModel.webContents.send("getMiniInfo", data);
  });
  ipcMain.on("setBounds", (e, data, isShow, type) => {
    if (isShow) {
      if (type === "list") {
        global.miniModel.setMaximumSize(600, 1000);
        global.miniModel.setMinimumSize(320, 320);
      } else {
        global.miniModel.setMaximumSize(500, 50);
        global.miniModel.setMinimumSize(320, 50);
      }
      global.miniModel.setAspectRatio(0);
    } else {
      global.miniModel.setMaximumSize(600, 600);
      global.miniModel.setMinimumSize(320, 320);
      global.miniModel.setAspectRatio(1);
    }
    global.miniModel.setBounds({ height: data }, true);
  });
  ipcMain.on("getBounds", e => {
    e.returnValue = global.miniModel.getBounds();
  });
}
