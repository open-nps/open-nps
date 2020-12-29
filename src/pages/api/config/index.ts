import { NextApiRequest, NextApiResponse } from 'next';

import Config, { IConfig } from '~/model/Config';
import { createApiHandler } from '~/util/api';

export const findConfigs = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const configs = await Config.find().lean();
  return res.json({ configs });
};

export const createConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const configs: IConfig = new Config(req.body);
  const savedConfig = await configs.save();

  return res.json(savedConfig);
};

export default createApiHandler({
  GET: findConfigs,
  POST: createConfig,
});
