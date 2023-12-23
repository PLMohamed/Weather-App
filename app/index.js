const { app, BrowserWindow, Menu,Tray, ipcMain } = require('electron');
const { autoUpdater, AppUpdater } = require('electron-updater');
const AutoLaunch = require('auto-launch');
const path = require('path');
const fs = require('fs');
const { menu } = require('./modules/menus');
const { createOptionWindow } = require('./modules/option');
const config = require('../config');
const gotTheLock = app.requestSingleInstanceLock();
let optionWindow = null;
let mainWindow = null;


// Flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


// Make sure only one app at the time
if (!gotTheLock) {
  app.quit();
  return
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
  return;
}


// Functions
const createWindow = async () => {
  // Create the browser window.
  var mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    resizable:config.ISDEV === "true" ? true:false,
    autoHideMenuBar:true,
    show:false,
    icon:path.join(__dirname,"assets/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools:config.ISDEV === "true" ? true:false,
      nodeIntegration:true,
      contextIsolation:true
    },
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  mainWindow.setMenu(mainMenu);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/weather/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  var settings = await loadSettings();


  // AutoLaunch
  let autoLaunch = new AutoLaunch({
    name: 'Weather App',
    path: app.getPath('exe'),
  });

  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled && settings.autoLaunch) autoLaunch.enable();
  });

  let tray = null;

  // MainWindow functions
  mainWindow.on('minimize',(e) => {
    e.preventDefault();
    mainWindow.hide();
    tray = createTray();
    
  });

  mainWindow.on('restore',() =>{
    mainWindow.show();
    tray.destroy();
  });

  mainWindow.on('close',(e) => {
    e.preventDefault();
    mainWindow.hide();
    tray = createTray();
  });

  mainWindow.on('ready-to-show',() =>{
    // To make sure api called and content are fully loaded
    setTimeout(() => {
      mainWindow.show();
    }, 100);
  });

  // IPC
  ipcMain.handle('getSettings',async (event) => {
    settings = await loadSettings();//To update , make sure for any update
    return settings;
  });
  
  ipcMain.on('setSettings',async(event,setting) => {
    await saveSettings(setting);
    setting = await loadSettings();
  });



  return mainWindow;
};

function createTray() {
  let tray = new Tray(path.join(__dirname,"assets/icon.png"));
  tray.setToolTip('Weather App');
  tray.on("click",() => {
    mainWindow.show();
    tray.destroy();
  })
  const contextMenu = Menu.buildFromTemplate(trayMenu);
  tray.setContextMenu(contextMenu);

  return tray;
}

function loadSettings() {
  const settingsPath = path.join(app.getPath('userData'), 'settings.json');
  try {
    const data = fs.readFileSync(settingsPath);
    return JSON.parse(data);
  } catch (error) {
    return {
      autoLaunch: true,
      notifications: true
    };
  }
}

function saveSettings(settings){
  const settingsPath = path.join(app.getPath('userData'), 'settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify(settings));
}


app.on('ready', async () => {

  if(BrowserWindow.getAllWindows().length !== 0)
    return;

  mainWindow = await createWindow();
  autoUpdater.checkForUpdates();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) 
    createWindow();
  
});

autoUpdater.on('update-available',(info) => {
  let p = autoUpdater.downloadUpdate();
})



const trayMenu = [
  {
    label:"Option",
    click : () => {
      if(optionWindow)
        return;

      optionWindow = createOptionWindow();
      optionWindow.on('close',() => optionWindow = null)
    }
  },
  {
    type:"separator"
  },
  {
    label:"Exit",
    click : () => {
      mainWindow.destroy();
      app.quit();
    }
  }
]




