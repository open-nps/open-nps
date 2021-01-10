import { NextApiRequest, NextApiResponse } from 'next';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { v4 as uuid } from 'uuid';

import Config, { IConfig } from '~/model/Config';
import { createApiHandler } from '~/util/api';

const parser = new MongooseQueryParser();

export const findConfigs = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { filter, ...opts } = parser.parse(req.query);
  const configs = await Config.find(filter, opts);
  return res.json({ configs });
};

export const createConfig = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const body = req.body;

  if (!body.alias) {
    body.alias = `${body.key}-${uuid}`;
  }

  const config: IConfig = await Config.create(req.body);
  return res.json(config);
};

export default createApiHandler({
  GET: findConfigs,
  POST: createConfig,
});
