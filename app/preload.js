// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const config = require('../forge.config');
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('config', {
  apikey: () => config.API_KEY,
})