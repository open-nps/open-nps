import { createApiHandler } from "../../../util/api"
import { NextApiRequest, NextApiResponse } from "next"
import { Config } from "../../../model"
import { IConfig } from "../../../model/Config";

export const findConfigs = async (req: NextApiRequest, res: NextApiResponse) => {
  const configs = await Config.find().lean();
  return res.json({ configs });
}

export const createConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const configs: IConfig = new Config(req.body);
  const savedConfig = await configs.save();

  return res.json(savedConfig);
}

export default createApiHandler({
  GET: findConfigs,
  POST: createConfig
})
