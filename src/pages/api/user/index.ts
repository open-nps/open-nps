import { NextApiRequest, NextApiResponse } from 'next';
import { MongooseQueryParser } from 'mongoose-query-parser';

import { createApiHandler } from '~/util/api';
import User, { IUser } from '~/model/User';
import { RoleEnum, authMiddleware } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

const parser = new MongooseQueryParser();

export const findUsers = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('findUsers');
  logger('http', 'Enter', { query: req.query });

  const { filter, ...opts } = parser.parse(req.query);
  logger('debug', 'pre-find', { filter, ...opts });
  const users = await User.find(filter, opts);

  logger('http', 'Out');
  return res.json({ users });
};

export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('createUser')('http', 'Enter', { body: req.body });
  const user: IUser = await User.create(req.body);
  return res.json(user);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.USER_READ], findUsers),
  POST: authMiddleware([RoleEnum.USER_WRITE], createUser),
});
