let miniModel;
let winURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}`
    : `file://${__dirname}/index.html`;

const createMiNiWindow = function (BrowserWindow) {
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
  return miniModel;
};
export default createMiNiWindow;
