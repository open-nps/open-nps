import merge from 'lodash.merge';
import { NextApiRequest, NextApiResponse } from 'next';

import Config, { IConfig } from '~/model/Config';
import { createApiHandler } from '~/util/api';

export const findConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const config = await Config.findOne({ _id: req.query.id });
  return res.json(config);
};

export const updateConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { key, alias, values = {} } = req.body;

  if (key) {
    return res.status(500).json({ message: 'Invalid field to change: <key>' });
  }

  const config: IConfig = await Config.findOne({ _id: req.query.id });
  const updates = { alias, values: merge(config.values, values) };

  await config.updateOne({
    alias,
    values: merge(config.values, values),
  });

  return res.json(merge(config, updates));
};

export default createApiHandler({
  GET: findConfig,
  PUT: updateConfig,
});
