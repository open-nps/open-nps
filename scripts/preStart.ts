import initUser from './initUser';
import downloadSchemaFiles from './downloadSchemaFiles';

export default async () =>
  await Promise.all([initUser(), downloadSchemaFiles()]);
