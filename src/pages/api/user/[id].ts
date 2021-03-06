import { NextApiRequest, NextApiResponse } from 'next';

import { createApiHandler } from '~/util/api';
import User, { IUser } from '~/model/User';
import { RoleEnum, authMiddleware } from '~/util/authMiddleware';
import { addOrPop } from '~/util/addOrPop';
import { LoggerNamespace } from '~/util/logger';

export const findUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('findUser')('http', 'Enter', { query: req.query });
  const user = await User.findOne({ _id: req.query.id });
  return res.json(user);
};

export const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('updateUser');
  logger('http', 'Enter', { body: req.body });

  const { roles } = req.body;
  const user: IUser = await User.findById(req.query.id);
  logger('debug', 'User', user);

  const newRoles = addOrPop(user.roles, roles) as RoleEnum[];
  logger('debug', 'pre-updateOne', { roles: newRoles });
  await user.updateOne({ roles: newRoles });

  logger('http', 'Out');
  return res.json({ ...user, roles: newRoles });
};

export const deleteUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('deleteUser');
  logger('http', 'Enter', { query: req.query });

  const deletedAt = new Date();
  const user: IUser = await User.findByIdAndUpdate(
    req.query.id,
    { deletedAt },
    { new: true }
  );

  logger('http', 'Out');
  return res.json(user);
};

export default createApiHandler({
  GET: authMiddleware([RoleEnum.USER_READ], findUser),
  PUT: authMiddleware([RoleEnum.USER_WRITE, RoleEnum.USER_UPDATE], updateUser),
  DELETE: authMiddleware([RoleEnum.USER_WRITE, RoleEnum.USER_READ], deleteUser),
});
