import { NextApiResponse, NextApiRequest } from 'next';

import Hook from '~/model/Hook';
import Target from '~/model/Target';

import { createApiHandler } from '~/util/api';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { addOrPop } from '~/util/addOrPop';
import { LoggerNamespace } from '~/util/logger';

export const createHook = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('createHook');
  logger('http', 'Enter', { body: req.body });
  const { targetName, ...hookData } = req.body;

  const { _id } = await Target.findOne({ name: targetName });
  logger('debug', 'pre-create', { target: _id, ...hookData });
  const hook = await Hook.create({ ...hookData, target: _id });

  logger('http', 'Out');
  return res.json(hook);
};

export const updateHook = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('updateHook');
  logger('http', 'Enter', { body: req.body });

  const { event, urls, targetName } = req.body;
  const target = await Target.findOne({ name: targetName });
  logger('debug', 'Target', target);

  const hook = await Hook.findOne({ event, target: target._id });
  logger('debug', 'Hook', hook);

  const newUrls = addOrPop(hook.urls, urls);
  logger('debug', 'pre-update', { urls: newUrls });
  await hook.updateOne({ urls: newUrls });

  logger('http', 'Out');
  return res.json({ _id: hook._id, event, target: target._id, urls: newUrls });
};

export default createApiHandler({
  POST: authMiddleware([RoleEnum.SETUP_WRITE], createHook),
  PUT: authMiddleware([RoleEnum.SETUP_READ, RoleEnum.SETUP_WRITE], updateHook),
});
