import { NextApiRequest, NextApiResponse } from 'next';

import Target, { ITarget } from '~/model/Target';
import { createApiHandler } from '~/util/api';

export const findTargets = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const targets = await Target.find();
  return res.json({ targets });
};

export const createTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const target: ITarget = await Target.create(req.body);
  return res.json(target);
};

export default createApiHandler({
  GET: findTargets,
  POST: createTarget,
});
