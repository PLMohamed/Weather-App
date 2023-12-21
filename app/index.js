const { app, BrowserWindow, Menu,Tray } = require('electron');
const path = require('path');
require("dotenv").config();
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    resizable:process.env.ISDEV === "true" ? true:false,
    autoHideMenuBar:true,
    icon:path.join(__dirname,"assets/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools:process.env.ISDEV === "true" ? true:false,
      nodeIntegration:true,
      contextIsolation:true
    },
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  mainWindow.setMenu(mainMenu);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  // Tray
  tray = new Tray(path.join(__dirname,"assets/icon.png"));
  tray.setToolTip('Weather App');
  tray.on("click",() => mainWindow.show())
  const contextMenu = Menu.buildFromTemplate(trayMenu);
  tray.setContextMenu(contextMenu);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  
};


app.on('ready', createWindow);




app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const menu = []

const trayMenu = [
  {
    label:"Option",
    onclick : () => {
      
    }
  },
  {
    type:"separator"
  },
  {
    label:"Exit",
    click : () => app.quit()
  }
]

