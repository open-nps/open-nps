import { NextApiRequest, NextApiResponse } from 'next';

import Target, { ITarget } from '~/model/Target';
import { createApiHandler } from '~/util/api';

const addOrPop = (listOne: string[], listTwo: string[]): string[] => {
  const diff = (arr1, arr2) =>
    arr1.filter((a1) => !arr2.some((a2) => a1 === a2));
  const [larger, smaller] =
    listOne.length >= listTwo.length ? [listOne, listTwo] : [listTwo, listOne];

  return diff(larger, smaller).concat(diff(smaller, larger));
};

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

export default createApiHandler({
  GET: findTarget,
  PUT: updateTarget,
});
