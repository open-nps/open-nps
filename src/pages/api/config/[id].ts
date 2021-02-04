import merge from 'lodash.merge';
import { NextApiRequest, NextApiResponse } from 'next';

import Config, { IConfig } from '~/model/Config';
import { createApiHandler } from '~/util/api';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

export const findConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('findConfig')('http', 'Enter', { query: req.query });
  const config = await Config.findOne({ _id: req.query.id });
  return res.json(config);
};

export const updateConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('updateConfig');

  logger('http', 'Enter');
  const { key, alias, values = {} } = req.body;

  if (key) {
    logger('http', 'Error', { body: req.body });
    return res.status(500).json({ message: 'Invalid field to change: <key>' });
  }

  const config: IConfig = await Config.findOne({ _id: req.query.id });
  const updates = { alias, values: merge(config.values, values) };

  logger('debug', 'pre-updateOn', updates);
  await config.updateOne({
    alias,
    values: merge(config.values, values),
  });

  logger('http', 'Out');
  return res.json(merge(config, updates));
};

export const deleteConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('deleteConfig');
  logger('http', 'Enter', { query: req.query });
  const updates = { deletedAt: new Date() };
  const config: IConfig = await Config.findOne({ _id: req.query.id });

  await config.updateOne(updates);
  logger('http', 'Out');
  return res.json(updates);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.SETUP_READ], findConfig),
  PUT: authMiddleware(
    [RoleEnum.SETUP_READ, RoleEnum.SETUP_WRITE],
    updateConfig
  ),
  DELETE: authMiddleware(
    [RoleEnum.SETUP_READ, RoleEnum.SETUP_WRITE],
    deleteConfig
  ),
});
