const { BrowserWindow , Menu} = require('electron');
const path = require('path');
const { menu } = require('./menus');
const config = require('../../config');


const createOptionWindow = () =>{
    var optionWindow = new BrowserWindow({
        width:500,
        height:500,
        resizable:config.ISDEV === "true" ? true : false,
        autoHideMenuBar:true,
        icon:path.join(__dirname,"../assets/icon.png"),
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            devTools:config.ISDEV === "true" ? true : false,
        }
    })

    optionWindow.loadURL(path.join(__dirname,'../src/settings/settings.html'));

    optionWindow.webContents.openDevTools();

    const optionMenu = Menu.buildFromTemplate(menu);
    optionWindow.setMenu(optionMenu);

    // Option Window Functions
    optionWindow.on('ready-to-show',() => optionWindow.show());


    return optionWindow;
}

module.exports = {createOptionWindow}