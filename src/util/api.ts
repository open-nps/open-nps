import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { connectMongo } from './mongo';

type Handlers = {
  GET?: NextApiHandler;
  POST?: NextApiHandler;
  PUT?: NextApiHandler;
  DELETE?: NextApiHandler;
};

export const createApiHandler = (handlers: Handlers): NextApiHandler => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await connectMongo();
  return handlers[req.method](req, res);
};
