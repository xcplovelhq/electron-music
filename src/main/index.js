"use strict";

import { app, protocol, BrowserWindow, Menu } from "electron";
import {
  createProtocol
  /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";
import initIpcEvent from "./ipcEvent";
import createLoginWindow from "./window/login";
import createMiNiWindow from "./window/mini";
import createLyrinWindow from "./window/lyric";
import createTray from "./tray";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");

let win;
let logoIcon = path.join(__dirname, "bundled/img/logo.png");
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    minWidth: 1000,
    minHeight: 650,
    height: 650,
    simpleFullscreen: true,
    titleBarStyle: "hiddenInset",
    icon: logoIcon,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      scrollBounce: true,
      nodeIntegration: true
    }
  });
  if (process.platform === "darwin") {
    app.dock.setIcon(logoIcon);
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
  win.on("enter-full-screen", () => {
    win.webContents.send("getFullScreen", true);
  });
  win.on("leave-full-screen", () => {
    win.webContents.send("getFullScreen", false);
  });

  global.win = win;
  win.on("closed", () => {
    win = null;
  });
  initIpcEvent();
}

app.setName("网易云音乐");

// 菜单
const isMac = process.platform === "darwin";
const template = [
  {
    label: "编辑",
    role: "editMenu",
    submenu: [
      {
        label: "撤销",
        accelerator: "CmdOrCtrl+Z",
        role: "undo"
      },
      {
        label: "重做",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo"
      },
      {
        type: "separator"
      },
      {
        label: "剪切",
        accelerator: "CmdOrCtrl+X",
        role: "cut"
      },
      {
        label: "复制",
        accelerator: "CmdOrCtrl+C",
        role: "copy"
      },
      {
        label: "粘贴",
        accelerator: "CmdOrCtrl+V",
        role: "paste"
      },
      {
        label: "全选",
        accelerator: "CmdOrCtrl+A",
        role: "selectall"
      }
    ]
  },
  {
    label: "控制",
    submenu: [
      {
        label: "播放",
        accelerator: "space",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("control", { type: "play" });
        }
      },
      {
        label: "下一个",
        accelerator: "CmdOrCtrl+Right",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("control", { type: "next" });
        }
      },
      {
        label: "上一个",
        accelerator: "CmdOrCtrl+Left",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("control", { type: "prev" });
        }
      },
      {
        label: "升高音量",
        accelerator: "CmdOrCtrl+Up",
        role: "undo"
      },
      {
        label: "降低音量",
        accelerator: "CmdOrCtrl+Down",
        role: "undo"
      },
      {
        label: "喜欢歌曲",
        accelerator: "CmdOrCtrl+L",
        role: "undo"
      },
      {
        label: "循环播放",
        accelerator: "",
        role: "undo",
        submenu: [
          {
            label: "单曲",
            accelerator: "",
            role: "undo"
          },
          {
            label: "全部",
            accelerator: "",
            role: "undo"
          }
        ]
      },
      {
        label: "随机播放",
        accelerator: "",
        role: "undo"
      },
      {
        label: "打开/关闭歌词",
        accelerator: "CmdOrCtrl+R",
        role: "reload"
      }
    ]
  },
  {
    label: "窗口",
    role: "window",
    submenu: [
      {
        label: "最小化",
        accelerator: "CmdOrCtrl+M",
        role: "minimize"
      },
      {
        label: "关闭窗口",
        accelerator: "CmdOrCtrl+W",
        role: "close"
      },
      {
        label: "缩放",
        role: "zoom"
      },
      {
        label: "进入全屏幕",
        accelerator: "Ctrl+CmdOrCtrl+F",
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      },
      {
        type: "separator"
      },
      {
        label: "切换至mini模式",
        role: "zoom"
      }
    ]
  },
  {
    label: "帮助",
    role: "help",
    submenu: []
  }
];

if (isMac) {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: []
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createTray();

  createWindow();
  win.show();
  global.miniModel = createMiNiWindow(BrowserWindow);
  global.loginModel = createLoginWindow(BrowserWindow);
  global.lyricModel = createLyrinWindow(BrowserWindow);
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
