'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const express = require("express");
// const expressApp = express();

const port = 5000

// expressApp.get('/', (req, res) => {
//     res.send('Hello World!')
//     createWindow();
// })

// expressApp.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*
unsure

const dialog = electron.dialog;
const Menu = electron.Menu;
const Tray = electron.Tray;
const shell = electron.shell;

// NOTE: this looks like it does nothing, but it's very important.
// Without it the default behaviour is to quit the app once all windows closed
// which is absolutely not what we want for a taskbar application.
app.on('window-all-closed', function() {
});

var LogWindow = function(ac, ds) {
    this.ac = ac;
    this.ds = ds;
    this.window = null;
    this.acMonitor = null;
    this.dsMonitor = null;
}
LogWindow.prototype = {
    open: function() {
        if (this.window) {
            this.window.show();
            this.window.restore();
            return;
        }
        // Create the browser window.
        this.window = new BrowserWindow({ width: 700, height: 500, icon: appIcon });
        this.window.loadURL('file://' + __dirname + '/log.html');

        if (!debug) {
            this.window.setMenu(null);
        }

        this.window.on('closed', function() {
            this.window = null;
        }.bind(this));
    },
    close: function() {
        if (this.window) {
            this.window.close();
        }
    }
};

const httpStatusPort = 60332;

*/
// global.log = require('electron-log');

// print out uncaught exceptions in the console
// process.on('uncaughtException', function(err) {
//     log.error(err);
//     log.error(err.stack);
// });

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
//   log.warn("Another instance of the screenshare is already running - this instance will quit.");
  app.exit(0);
  return;
}

var window;
function createWindow(){
    const zoomFactor = 0.8;
    var window = new BrowserWindow({
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
});

