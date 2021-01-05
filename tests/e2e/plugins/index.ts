/// <reference types="cypress" />
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');

const plugins: Cypress.PluginConfig = (on, config): void => {
  getCompareSnapshotsPlugin(on, config);

  on('before:browser:launch', (Browser, Launchargs) => {
    if (Browser.name === 'chrome' || Browser.name === 'electron') {
      Launchargs.args.push('--disable-dev-shm-usage');
    }

    return Launchargs;
  });
};

export default plugins;
