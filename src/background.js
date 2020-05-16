"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu, shell } from "electron";
import {
  createProtocol
  /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";

const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let loginWin;
let miniModel;
let winURL;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
winURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}`
    : `file://${__dirname}/index.html`;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    minWidth: 1000,
    minHeight: 650,
    height: 650,
    titleBarStyle: "hiddenInset",
    icon: path.join(__dirname, "bundled/img/logo.png"),
    skipTaskbar: true,
    webPreferences: {
      scrollBounce: true,
      nodeIntegration: true
    }
  });
  if (process.platform === "darwin") {
    app.dock.setIcon(path.join(__dirname, "bundled/img/logo.png"));
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

function openWin () {
  loginWin = new BrowserWindow({
    // resizable: false,
    width: 350,
    height: 520,
    frame: false,
    parent: win, // win是主窗口
    webPreferences: {
      nodeIntegration: true
    }
  });

  // win.loadURL(winURL);
  loginWin.webContents.openDevTools({ mode: "right" });

  loginWin.loadURL(winURL + "#/login");
  loginWin.on("closed", () => {
    loginWin = null;
  });
}
function openMiniModel () {
  miniModel = new BrowserWindow({
    width: 500,
    height: 500,
    // maxWidth: 500,
    // maxHeight: 500,
    // minWidth: 220,
    // minHeight: 220,
    frame: false,
    show: false,
    titleBarStyle: "default",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // win.loadURL(winURL);
  miniModel.webContents.openDevTools({ mode: "right" });

  miniModel.loadURL(winURL + "#/miniModel");
  miniModel.on("resize", () => {
    miniModel.webContents.send("getSize", miniModel.getBounds());
  });
  miniModel.setMaximumSize(600, 600);
  miniModel.setMinimumSize(320, 320);
  miniModel.setAspectRatio(1);

  miniModel.on("closed", () => {
    miniModel = null;
  });
}

ipcMain.on("play", () => {
  win.webContents.send("play", 1);
});
ipcMain.on("openWin", () => openWin());
ipcMain.on("changeMini", () => {
  if (win.isVisible()) {
    miniModel.show();
    win.hide();
  } else {
    miniModel.hide();
    win.show();
  }
});

ipcMain.on("login", () => {
  loginWin.close();
});
ipcMain.on("closeWin", () => {
  loginWin.close();
});
ipcMain.on("setUserInfo", (e, data) => {
  win.webContents.send("setUserInfoData", data);
});
ipcMain.on("openUrl", (e, data) => {
  shell.openExternal(data);
});
ipcMain.on("control", (e, data) => {
  win.webContents.send("control", data);
});
ipcMain.on("setMiniInfo", (e, data) => {
  miniModel.webContents.send("getMiniInfo", data);
});
ipcMain.on("setBounds", (e, data, isShow, type) => {
  if (isShow) {
    if (type === "list") {
      miniModel.setMaximumSize(600, 1000);
      miniModel.setMinimumSize(320, 320);
    } else {
      miniModel.setMaximumSize(500, 50);
      miniModel.setMinimumSize(320, 50);
    }
    miniModel.setAspectRatio(0);
  } else {
    miniModel.setMaximumSize(600, 600);
    miniModel.setMinimumSize(320, 320);
    miniModel.setAspectRatio(1);
  }
  miniModel.setBounds({ height: data }, true);
});
ipcMain.on("getBounds", e => {
  e.returnValue = miniModel.getBounds();
});

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
          focusedWindow.webContents.send("control", "play");
        }
      },
      {
        label: "下一个",
        accelerator: "CmdOrCtrl+Right",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("control", "next");
        }
      },
      {
        label: "上一个",
        accelerator: "CmdOrCtrl+Left",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("control", "prev");
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

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createWindow();
  openMiniModel();
});

// Exit cleanly on request from parent process in development mode.
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
