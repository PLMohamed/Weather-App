const { BrowserWindow , Menu} = require('electron');
const path = require('path');
const { menu } = require('./menus');

const createOptionWindow = () =>{
    var optionWindow = new BrowserWindow({
        width:400,
        height:400,
        resizable:process.env.ISDEV === "true" ? true : false,
        autoHideMenuBar:true,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:true,
            devTools:process.env.ISDEV === "true" ? true : false,
        }
    })

    optionWindow.loadURL(path.join(__dirname,'../src/settings/settings.html'));

    const optionMenu = Menu.buildFromTemplate(menu);
    optionWindow.setMenu(optionMenu);

    // Option Window Functions
    optionWindow.on('ready-to-show',() => optionWindow.show());


    return optionWindow;
}

module.exports = {createOptionWindow}