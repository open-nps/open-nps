import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { connectMongo } from "./mongo"

export const createApiHandler = (handlers): NextApiHandler => async (req: NextApiRequest, res: NextApiResponse) => {
  await connectMongo();
  handlers[req.method](req, res);
}
