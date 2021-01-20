import initUser from './initUser';
import downloadSchemaFiles from './downloadSchemaFiles';
import preStart from './preStart';

const script = {
  initUser,
  downloadSchemaFiles,
  preStart,
}[process.argv[2]];

script().then(() => {
  process.exit(0);
});
