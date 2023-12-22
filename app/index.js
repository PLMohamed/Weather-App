const { app, BrowserWindow, Menu,Tray } = require('electron');
const AutoLaunch = require('auto-launch');
const path = require('path');
const { menu } = require('./modules/menus');
const { createOptionWindow } = require('./modules/option');
const config = require('../config');
let optionWindow = null;
let mainWindow = null;



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



  // AutoLaunch
  let autoLaunch = new AutoLaunch({
    name: 'weather app',
    path: app.getPath('exe'),
  });

  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
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

// Functions
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


app.on('ready', () => {
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




