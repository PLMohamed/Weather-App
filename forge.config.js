require('dotenv').config();
module.exports = {
  API_KEY: process.env.API_KEY,
  ISDEV : process.env.ISDEV,
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'PLMohamed',
        description: 'Weather app'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        authors: 'PLMohamed',
        description: 'Weather app'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        authors: 'PLMohamed',
        description: 'Weather app'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {
        authors: 'PLMohamed',
        description: 'Weather app'
      },
    },
  ],
};
