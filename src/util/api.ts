import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

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
  const { connectMongo } = await import('./mongo');

  await connectMongo();
  return handlers[req.method](req, res);
};
