let loginWin;
let winURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}`
    : `file://${__dirname}/index.html`;

const createLoginWindow = function (BrowserWindow) {
  loginWin = new BrowserWindow({
    // resizable: false,
    width: 350,
    height: 520,
    frame: false,
    show: false,
    parent: global.win, // win是主窗口
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
  return loginWin;
};

export default createLoginWindow;
