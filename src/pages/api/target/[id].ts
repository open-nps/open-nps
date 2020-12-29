import { createApiHandler } from "../../../util/api"
import { NextApiRequest, NextApiResponse } from "next"
import { Target } from "../../../model"
import { ITarget } from "../../../model/Target";

const addOrPop = (listOne: string[], listTwo: string[]) => {
  const diff = (arr1, arr2) => arr1.filter(a1 => !arr2.some(a2 => a1 === a2));
  const [larger, smaller] = listOne.length >= listTwo.length ? [listOne, listTwo] : [listTwo, listOne];

  return diff(larger, smaller).concat(diff(smaller, larger));
}

export const findTarget = async (req: NextApiRequest, res: NextApiResponse) => {
  const target = await Target.findOne({ _id: req.query.id }).lean();
  return res.json(target);
}

export const updateTarget = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, meta = {}, configs = [] } = req.body;

  if (name) {
    return res.status(500).json({ message: 'Invalid field to change: <name>'})
  }

  const target: ITarget = await Target.findOne({ _id: req.query.id });
  const newTarget = await target.updateOne({
    meta: { ...target.meta, ...meta },
    configs: addOrPop(target.configs as string[], configs)
  }, { new: true });

  return res.json(newTarget);
}

export default createApiHandler({
  GET: findTarget,
  PUT: updateTarget
})
