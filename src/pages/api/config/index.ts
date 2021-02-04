import { NextApiRequest, NextApiResponse } from 'next';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { v4 as uuid } from 'uuid';

import Config, { IConfig } from '~/model/Config';
import { createApiHandler } from '~/util/api';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

const parser = new MongooseQueryParser();

export const findConfigs = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('findConfigs');

  logger('http', 'Enter', { query: req.query });
  const { filter, ...opts } = parser.parse(req.query);

  logger('debug', 'pre-find', { filter, opts });
  const configs = await Config.find(filter, opts);

  logger('http', 'Out');
  return res.json({ configs });
};

export const createConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('createConfig');
  const body = req.body;

  logger('http', 'Enter', { body });

  if (!body.alias) {
    body.alias = `${body.key}-${uuid}`;
    logger('debug', 'autogenerate', { alias: body.alias });
  }

  const config: IConfig = await Config.create(req.body);

  logger('http', 'Out');
  return res.json(config);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.SETUP_READ], findConfigs),
  POST: authMiddleware([RoleEnum.SETUP_WRITE], createConfig),
});
