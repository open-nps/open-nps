import './chainable';
import './element';
import './api';

const compareSnapshotCommand = require('cypress-visual-regression/dist/command');

compareSnapshotCommand({
  capture: 'fullPage',
});
