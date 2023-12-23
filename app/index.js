const { app, BrowserWindow, Menu,Tray } = require('electron');
const AutoLaunch = require('auto-launch');
const path = require('path');
const { menu } = require('./modules/menus');
const { createOptionWindow } = require('./modules/option');
const config = require('../config');
let optionWindow = null;
let mainWindow = null;
const { updateElectronApp } = require('update-electron-app');
const gotTheLock = app.requestSingleInstanceLock();

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
const createWindow = () => {
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

  const settings = loadSettings();


  // AutoLaunch
  let autoLaunch = new AutoLaunch({
    name: 'weather app',
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
    
  })

  mainWindow.on('restore',() =>{
    mainWindow.show();
    tray.destroy();
  })

  mainWindow.on('close',(e) => {
    e.preventDefault();
    mainWindow.hide();
    tray = createTray();
  })

  mainWindow.on('ready-to-show',() =>{
    // To make sure api called and content are fully loaded
    setTimeout(() => {
      mainWindow.show();
    }, 100);
  })
  



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


app.on('ready', () => {
  updateElectronApp({
    updateInterval: '30 min'
  }); 
  if(BrowserWindow.getAllWindows().length !== 0)
    return;

  mainWindow = createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) 
    createWindow();
  
});


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
    }
  }
]




