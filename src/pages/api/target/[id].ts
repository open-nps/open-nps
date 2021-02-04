import { NextApiRequest, NextApiResponse } from 'next';

import Target, { ITarget } from '~/model/Target';
import { createApiHandler } from '~/util/api';
import { addOrPop } from '~/util/addOrPop';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

export const findTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('findTarget')('http', 'Enter', { query: req.query });
  const target = await Target.findOne({ _id: req.query.id });
  return res.json(target);
};

export const updateTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('updateTarget');
  logger('http', 'Enter', { body: req.body, query: req.query });

  const { name, meta = {}, configs = [] } = req.body;

  if (name) {
    logger('http', 'Error', { message: 'Invalid field to change: <name>' });
    return res.status(500).json({ message: 'Invalid field to change: <name>' });
  }

  const target: ITarget = await Target.findOne({ _id: req.query.id });
  logger('debug', 'Target', target);

  const newData = {
    meta: { ...target.meta, ...meta },
    configs: addOrPop(target.configs as string[], configs),
  };

  logger('debug', 'pre-update', newData);
  await target.updateOne(newData);

  logger('http', 'Out');
  return res.json({ name: target.name, ...newData });
};

export const deleteTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('deleteTarget');
  logger('http', 'Enter', { query: req.query });

  const updates = { deletedAt: new Date() };
  const target: ITarget = await Target.findOne({ _id: req.query.id });
  logger('debug', 'Target', target);
  logger('debug', 'pre-update', updates);
  await target.updateOne(updates);

  logger('http', 'Out');
  return res.json(updates);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.SETUP_READ], findTarget),
  PUT: authMiddleware([RoleEnum.SETUP_WRITE], updateTarget),
  DELETE: authMiddleware(
    [RoleEnum.SETUP_READ, RoleEnum.SETUP_WRITE],
    deleteTarget
  ),
});
