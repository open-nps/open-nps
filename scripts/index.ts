import initUser from './initUser';
import downloadSchemaFiles from './downloadSchemaFiles';
import start from './start';

const script = {
  initUser,
  downloadSchemaFiles,
  start,
}[process.argv[2]];

script()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
