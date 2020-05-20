let lyricModel;
let winURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}`
    : `file://${__dirname}/index.html`;

const createLyrinWindow = function(BrowserWindow) {
  lyricModel = new BrowserWindow({
    width: 848,
    height: 63,
    // maxWidth: 500,
    // maxHeight: 500,
    // minWidth: 220,
    // minHeight: 220,
    focusable: false,
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // win.loadURL(winURL);
  // lyricModel.webContents.openDevTools({ mode: "right" });

  lyricModel.loadURL(winURL + "#/modelLyric");

  lyricModel.on("closed", () => {
    lyricModel = null;
  });
  return lyricModel;
};
export default createLyrinWindow;
