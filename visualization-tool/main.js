/**
 * Electron boilerplate that creates window and runs index.html
 */

const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

let win;

function createWindow () {
    win = new BrowserWindow({
        width:830,
        height: 600,
        minWidth: 830,
        minHeight: 600,
        icon: path.join(__dirname, 'icons/64x64.png')
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
    }));

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
}
});

app.on('activate', () => {
    if(win===null){
        createWindow()
    }
});




