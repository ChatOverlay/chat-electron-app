const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore);
  },
  onClearLocalStorage: (callback) => {
    ipcRenderer.on('clear-local-storage', callback);
  }
});
