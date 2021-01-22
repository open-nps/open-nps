import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { Role, IUser } from '~/model/User';
import Token, { IToken } from '~/model/Token';

export { RoleEnum } from '~/model/User';

export const authMiddleware = (
  roles: typeof Role[number][],
  callback: NextApiHandler
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const token: IToken = await Token.findOne({
    hash: req.headers.authorization,
  }).populate('user');
  const hasOneOrMoreRoles = token
    ? roles.every((role) => (token.user as IUser).roles.indexOf(role) > -1)
    : false;

  if (!hasOneOrMoreRoles && roles.length > 0) {
    return res.status(403).json({ authorization: 'denied' });
  }

  return await callback(req, res);
};
