import { NextApiRequest, NextApiResponse } from 'next';

import Tag, { ITag } from '~/model/Tag';
import { createApiHandler } from '~/util/api';
import { addOrPop } from '~/util/addOrPop';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

export const findTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('findTag')('http', 'Enter', { query: req.query });
  const tag = await Tag.findOne({ _id: req.query.id });
  return res.json(tag);
};

export const updateTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('updateTag');

  logger('http', 'Enter', { body: req.body, query: req.query });
  const { name, overrideConfigs = [] } = req.body;

  if (name) {
    logger('http', 'Error', { message: 'Invalid field to change: <name>' });
    return res.status(500).json({ message: 'Invalid field to change: <name>' });
  }

  const tag: ITag = await Tag.findOne({ _id: req.query.id });
  logger('debug', 'Tag', tag);
  const newData = {
    overrideConfigs: addOrPop(tag.overrideConfigs as string[], overrideConfigs),
  };

  logger('debug', 'pre-update', newData);
  await tag.updateOne(newData);

  logger('http', 'Out');
  return res.json({ name: tag.name, ...newData });
};

export const deleteTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('updateTag');

  logger('http', 'Enter', { query: req.query });
  const updates = { deletedAt: new Date() };
  const tag: ITag = await Tag.findOne({ _id: req.query.id });

  logger('debug', 'Tag', tag);
  logger('debug', 'pre-update', updates);

  await tag.updateOne(updates);

  logger('http', 'Out');
  return res.json(updates);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.TAG_READ], findTag),
  PUT: authMiddleware([RoleEnum.TAG_READ, RoleEnum.TAG_WRITE], updateTag),
  DELETE: authMiddleware([RoleEnum.TAG_READ, RoleEnum.TAG_WRITE], deleteTag),
});
