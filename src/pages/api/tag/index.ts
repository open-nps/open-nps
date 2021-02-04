import { NextApiRequest, NextApiResponse } from 'next';
import { MongooseQueryParser } from 'mongoose-query-parser';

import Tag, { ITag } from '~/model/Tag';
import { createApiHandler } from '~/util/api';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

const parser = new MongooseQueryParser();

export const findTags = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('findTags');
  logger('http', 'Enter', { query: req.query });

  const { filter, ...opts } = parser.parse(req.query);

  logger('debug', 'pre-find', { filter, ...opts });
  const tags = await Tag.find(filter, opts);

  logger('http', 'Out');
  return res.json({ tags });
};

export const createTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('createTag')('http', 'Enter', { body: req.body });
  const tag: ITag = await Tag.create(req.body);
  return res.json(tag);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.TAG_READ], findTags),
  POST: authMiddleware([RoleEnum.TAG_WRITE], createTag),
});
