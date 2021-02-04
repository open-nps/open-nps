import get from 'lodash.get';

import { createApiHandler } from '~/util/api';
import { NextApiRequest, NextApiResponse } from 'next';
import User, { IUser } from '~/model/User';
import Token from '~/model/Token';
import { v4 as uuid } from 'uuid';
import { authMiddleware } from '~/util/authMiddleware';
import { LoggerNamespace } from '~/util/logger';

export const createToken = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('createToken');
  const { email, password } = req.body;
  logger('http', 'Enter', { email });
  logger('debug', 'willUseToken', !!req.headers.authorization);

  const user: IUser = req.headers.authorization
    ? get(
        await Token.findOne({ hash: req.headers.authorization }).populate(
          'user'
        ),
        'user',
        null
      )
    : await User.findByEmailAndPassword(email, password);

  if (!user) {
    logger('http', 'Error', { message: 'credentials fail' });
    return res.status(404).json({ message: 'credentials fail' });
  }

  logger('http', 'Out');
  return res.json(await Token.create({ hash: uuid(), user: user._id }));
};

export const removeToken = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  LoggerNamespace('removeToken')('http', 'Enter');
  await Token.deleteOne({ hash: req.headers.authorization });
  return res.json({ ok: true });
};

export default createApiHandler({
  POST: createToken,
  DELETE: authMiddleware([], removeToken),
});
