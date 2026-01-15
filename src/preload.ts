import { contextBridge, ipcRenderer, ipcMain } from "electron";

window.versions = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
};

window.messaging = {
    log: (message) => {
        ipcRenderer.send("consoleLog", message);
    }
}