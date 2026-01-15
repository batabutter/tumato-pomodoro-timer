import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import * as path from "path";

const createWindow = () => {

    let dirName:string = '';

    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar:true,
        resizable: false
    });
    win.loadFile("index.html");

    globalShortcut.register('CommandOrControl+R', () => {
        win.reload();
    })
}

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

