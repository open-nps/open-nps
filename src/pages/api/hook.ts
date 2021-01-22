import { NextApiResponse, NextApiRequest } from 'next';

import Hook from '~/model/Hook';
import Target from '~/model/Target';

import { createApiHandler } from '~/util/api';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { addOrPop } from '~/util/addOrPop';

export const createHook = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { targetName, ...hookData } = req.body;

  const { _id } = await Target.findOne({ name: targetName });
  const hook = await Hook.create({ ...hookData, target: _id });

  return res.json(hook);
};

export const updateHook = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { event, urls, targetName } = req.body;
  const { _id } = await Target.findOne({ name: targetName });
  const hook = await Hook.findOne({ event, target: _id });
  const newUrls = addOrPop(hook.urls, urls);

  await hook.updateOne({ urls: newUrls });

  return res.json({ _id: hook._id, event, target: _id, urls: newUrls });
};

export default createApiHandler({
  POST: authMiddleware([RoleEnum.SETUP_WRITE], createHook),
  PUT: authMiddleware([RoleEnum.SETUP_READ, RoleEnum.SETUP_WRITE], updateHook),
});
