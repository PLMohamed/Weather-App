const { contextBridge } = require('electron')
const config = require('../config')

contextBridge.exposeInMainWorld('config', {
  apikey: () => config.API_KEY,
})