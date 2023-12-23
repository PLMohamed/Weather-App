const { ipcRenderer } = require("electron");

const settingAutoLaunch = document.getElementById('autolaunch');
const settingNotification = document.getElementById('notification');

ipcRenderer.invoke('getSettings').then((result) => {
    settingAutoLaunch.checked = result.autoLaunch;
    settingNotification.checked = result.notifications;
});

const changeSettings = () => {
    const settings = {
        autoLaunch : settingAutoLaunch.checked,
        notifications : settingNotification.checked,
    }

    ipcRenderer.send('setSettings',(settings));
}

settingAutoLaunch.onchange = () => changeSettings();
settingNotification.onchange = () => changeSettings();
