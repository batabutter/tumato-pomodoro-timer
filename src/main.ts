import { app, BrowserWindow, globalShortcut, ipcMain, ipcRenderer } from 'electron';
import * as path from "path";

const createWindow = () => {

    let dirName:string = '';

    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        icon: path.join(__dirname, "../assets/tumato.ico"),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false
        },
        autoHideMenuBar:true,
        resizable: false
    });
    win.loadFile("index.html");
    /* win.webContents.openDevTools(); */

    globalShortcut.register('CommandOrControl+R', () => {
        win.reload();
    })
}

if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {

    ipcMain.handle('ping', () => 'pong');

    createWindow();

    app.on('activate', () => { 
        if(BrowserWindow.getAllWindows().length === 0) 
            createWindow();
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') 
        app.quit();
});

ipcMain.on("consoleLog", (event, message) => {
    console.log(message);
});

ipcMain.handle("getAppState", () => ({
    isPackaged: app.isPackaged,
    appPath: app.getAppPath(),
    dataPath: path.join(app.getPath("userData"), "userData")
}))