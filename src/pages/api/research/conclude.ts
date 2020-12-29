import { createApiHandler } from "../../../util/api"
import { NextApiRequest, NextApiResponse } from "next"
import { Target, Research } from "../../../model";
import { IResearch } from "../../../model/Research";

const concludeResearch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { note, comment, researchId } = req.body;

  const research: IResearch = await Research.findOne({ _id: researchId, concluded: false });
  const response = await research.updateOne({ concluded: true, note, comment });

  return res.json(response)
}

export default createApiHandler({
  PUT: concludeResearch
})
