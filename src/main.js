const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  screen,
  shell,
  ipcMain,
} = require("electron");
const path = require("path");
const AutoLaunch = require("auto-launch");
const sound = require("sound-play"); // sound-play 모듈 로드

let tray = null;
let mainWindow = null;

// AutoLaunch 설정
const appLauncher = new AutoLaunch({
  name: "clatalk",
  path: process.execPath,
});
// 알림 소리를 위한 오디오 파일 경로
const notificationSoundPath = path.join(__dirname, 'assets', 'notification.mp3');

// 알림 소리를 재생하는 함수
function playNotificationSound() {
  sound.play(notificationSoundPath).catch((error) => {
    console.error("알림 소리 재생 오류:", error);
  });
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindowWidth = 500;
  const mainWindowHeight = 900;
  const x = width - mainWindowWidth;
  const y = height - mainWindowHeight;

  mainWindow = new BrowserWindow({
    width: mainWindowWidth,
    height: mainWindowHeight,
    x: x,
    y: y,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });
  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.setAlwaysOnTop(true, "screen");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  mainWindow.loadURL("https://chat-overlay-web-site.vercel.app/");

  ipcMain.on("set-ignore-mouse-events", (event, ignore) => {
    mainWindow.setIgnoreMouseEvents(ignore);
  });
  // 웹앱에서 알림 소리 요청을 받을 때 소리 재생
  ipcMain.on("play-notification-sound", () => {
    playNotificationSound();
  });
}

function restartApp() {
  app.relaunch();
  app.exit();
}

app.whenReady().then(() => {
  // 앱이 처음 시작될 때 자동으로 시작 프로그램에 추가
  appLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        appLauncher.enable();
      }
    })
    .catch((err) => {
      console.error("자동 시작 프로그램 상태 확인 중 오류:", err);
    });

  tray = new Tray(
    path.join(app.getAppPath(), "src", "assets", "tray_icon.png")
  );

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "설정",
      click: () => {
        mainWindow.webContents.send("clear-local-storage");
        restartApp(); // 앱 재시작
      },
    },
    {
      label: "종료",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("클라톡");
  tray.setContextMenu(contextMenu);
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
