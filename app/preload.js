const { contextBridge } = require('electron')
const config = require('../config')

contextBridge.exposeInMainWorld('KeyBridge', {
  apikey: () => config.API_KEY,
})