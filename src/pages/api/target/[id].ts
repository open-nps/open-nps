import { NextApiRequest, NextApiResponse } from 'next';

import Target, { ITarget } from '~/model/Target';
import { createApiHandler } from '~/util/api';
import { addOrPop } from '~/util/addOrPop';

export const findTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const target = await Target.findOne({ _id: req.query.id });
  return res.json(target);
};

export const updateTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { name, meta = {}, configs = [] } = req.body;

  if (name) {
    return res.status(500).json({ message: 'Invalid field to change: <name>' });
  }

  const target: ITarget = await Target.findOne({ _id: req.query.id });
  const newData = {
    meta: { ...target.meta, ...meta },
    configs: addOrPop(target.configs as string[], configs),
  };

  await target.updateOne(newData);
  return res.json({ name: target.name, ...newData });
};

export const deleteTarget = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const updates = { deletedAt: new Date() };
  const target: ITarget = await Target.findOne({ _id: req.query.id });

  await target.updateOne(updates);
  return res.json(updates);
};

export default createApiHandler({
  GET: findTarget,
  PUT: updateTarget,
  DELETE: deleteTarget,
});
