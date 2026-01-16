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

const initAppState = async () => {
    const retAppState = await ipcRenderer.invoke("getAppState");
    window.appState = retAppState;
    window.messaging.log(window.appState)
}

initAppState();