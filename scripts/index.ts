import initUser from './initUser';

const script = {
  initUser,
}[process.argv[2]];

script().then(() => {
  process.exit(0);
});
