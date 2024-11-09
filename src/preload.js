const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setIgnoreMouseEvents: (ignore) => {
    ipcRenderer.send("set-ignore-mouse-events", ignore);
  },
  onClearLocalStorage: (callback) => {
    ipcRenderer.on("clear-local-storage", callback);
  },
  // 웹에서 호출할 수 있는 알림 소리 재생 API 추가
  playNotificationSound: () => {
    ipcRenderer.send("play-notification-sound");
  },
});
