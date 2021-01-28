import initUser from './initUser';
import downloadSchemaFiles from './downloadSchemaFiles';
import { spawn } from 'child_process';

export default async () => {
  const cmd = process.argv[3] === 'prod' ? 'start' : 'dev';
  const rest = process.argv.splice(4);

  await Promise.all([initUser(), downloadSchemaFiles()]);
  return new Promise((_, reject) => {
    const next = spawn('next', [cmd, ...rest], { env: process.env });

    next.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    next.stderr.on('data', (data) => {
      console.log(`${data}`);
    });

    next.on('error', (error) => {
      reject(`error: ${error.message}`);
    });

    next.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
};
