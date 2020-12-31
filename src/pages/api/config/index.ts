import { NextApiRequest, NextApiResponse } from 'next';

import Config, { IConfig } from '~/model/Config';
import { createApiHandler } from '~/util/api';

export const findConfigs = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const configs = await Config.find();
  return res.json({ configs });
};

export const createConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const config: IConfig = await Config.create(req.body);
  return res.json(config);
};

export default createApiHandler({
  GET: findConfigs,
  POST: createConfig,
});
