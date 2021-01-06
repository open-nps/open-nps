import { NextApiRequest, NextApiResponse } from 'next';
import { createApiHandler } from '~/util/api';

export const healthCheck = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  return res.status(200).json({ ok: true });
};

export default createApiHandler({
  GET: healthCheck,
});
