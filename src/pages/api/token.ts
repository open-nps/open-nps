import get from 'lodash.get';

import { createApiHandler } from '~/util/api';
import { NextApiRequest, NextApiResponse } from 'next';
import User, { IUser } from '~/model/User';
import Token, { IToken } from '~/model/Token';
import { v4 as uuid } from 'uuid';
import { authMiddleware } from '~/util/authMiddleware';

export const createToken = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { email, password } = req.body;
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
    return res.status(404).json({ message: 'credentials fail' });
  }

  return res.json(await Token.create({ hash: uuid(), user: user._id }));
};

export const removeToken = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await Token.deleteOne({ hash: req.headers.authorization });
  return res.json({ ok: true });
};

export default createApiHandler({
  POST: createToken,
  DELETE: authMiddleware([], removeToken),
});
