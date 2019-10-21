'use strict';

var userName, displayName, token, apiKey, sessionID;

const {app, BrowserWindow, ipcMain} = require('electron');
const gotTheLock = app.requestSingleInstanceLock()
const argv = require('yargs').argv;
// ./screenshare.exe --userName=miladN ...

const connectionInfo = {
    userName: argv.userName || "testName",
    displayName: argv.displayName || "displayName",
    token: argv.token || "token",
    apiKey: argv.apiKey || "apiKey",
    sessionID: argv.sessionID || "sessionID"
}

if (!gotTheLock) {
//   log.warn("Another instance of the screenshare is already running - this instance will quit.");
  app.exit(0);
  return;
}

var window;
function createWindow(){
    const zoomFactor = 0.8;
    window = new BrowserWindow({
        width: 1920 * zoomFactor,
        height: 1080 * zoomFactor,
        center: true,
        frame: true,
        useContentSize: true,
        zoomFactor: zoomFactor,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadURL('file://' + __dirname + '/index.html');
    window.setMenu(null);
    window.show();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    createWindow();
    console.log("sending info");
    window.webContents.send('connectionInfo', JSON.stringify(connectionInfo))
});