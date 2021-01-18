import { NextApiRequest, NextApiResponse } from 'next';

import Tag, { ITag } from '~/model/Tag';
import { createApiHandler } from '~/util/api';
import { addOrPop } from '~/util/addOrPop';

export const findTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const tag = await Tag.findOne({ _id: req.query.id });
  return res.json(tag);
};

export const updateTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { name, overrideConfigs = [] } = req.body;

  if (name) {
    return res.status(500).json({ message: 'Invalid field to change: <name>' });
  }

  const tag: ITag = await Tag.findOne({ _id: req.query.id });
  const newData = {
    overrideConfigs: addOrPop(tag.overrideConfigs as string[], overrideConfigs),
  };

  await tag.updateOne(newData);
  return res.json({ name: tag.name, ...newData });
};

export const deleteTag = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const updates = { deletedAt: new Date() };
  const tag: ITag = await Tag.findOne({ _id: req.query.id });

  await tag.updateOne(updates);
  return res.json(updates);
};

export default createApiHandler({
  GET: findTag,
  PUT: updateTag,
  DELETE: deleteTag,
});
