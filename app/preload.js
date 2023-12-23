const { contextBridge , ipcRenderer} = require('electron')
const config = require('../config')

contextBridge.exposeInMainWorld('KeyBridge', {
  apikey: () => config.API_KEY,
});

contextBridge.exposeInMainWorld('Notifate',{
  showNotification : (title,body) => ipcRenderer.send('showNotification',title,body)
})