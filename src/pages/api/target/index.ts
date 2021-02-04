import { NextApiRequest, NextApiResponse } from 'next';
import { MongooseQueryParser } from 'mongoose-query-parser';

import Target, { ITarget } from '~/model/Target';
import { createApiHandler } from '~/util/api';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

const parser = new MongooseQueryParser();

export const findTargets = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('findTargets');
  logger('http', 'Enter', { query: req.query });

  const { filter, ...opts } = parser.parse(req.query);

  logger('debug', 'pre-find', { filter, ...opts });
  const targets = await Target.find(filter, opts);

  logger('http', 'Out');
  return res.json({ targets });
};

export const createTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('createTarget')('http', 'Enter', { body: req.body });
  const target: ITarget = await Target.create(req.body);
  return res.json(target);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.SETUP_READ], findTargets),
  POST: authMiddleware([RoleEnum.SETUP_WRITE], createTarget),
});
