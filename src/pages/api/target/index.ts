import { NextApiRequest, NextApiResponse } from "next"

import Target, { ITarget } from "~/model/Target";
import { createApiHandler } from "~/util/api"

export const findTargets = async (req: NextApiRequest, res: NextApiResponse) => {
  const targets = await Target.find().lean();
  return res.json({ targets });
}

export const createTarget = async (req: NextApiRequest, res: NextApiResponse) => {
  const target: ITarget = new Target(req.body);
  const savedTg = await target.save();

  return res.json(savedTg);
}

export default createApiHandler({
  GET: findTargets,
  POST: createTarget
})
