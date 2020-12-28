import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export const createApiHandler = (handlers) => (req: NextApiRequest, res: NextApiResponse): NextApiHandler => {
    return handlers[req.method](req, res);
}