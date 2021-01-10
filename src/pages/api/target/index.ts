import { NextApiRequest, NextApiResponse } from 'next';
import { MongooseQueryParser } from 'mongoose-query-parser';

import Target, { ITarget } from '~/model/Target';
import { createApiHandler } from '~/util/api';

const parser = new MongooseQueryParser();

export const findTargets = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { filter, ...opts } = parser.parse(req.query);
  const targets = await Target.find(filter, opts);
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
