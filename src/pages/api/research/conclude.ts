import { createApiHandler } from "../../../util/api"
import { NextApiRequest, NextApiResponse } from "next"
import { Target, Research } from "../../../model";

const concludeResearch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { note, comment, targetName, researchId } = req.body;

  const target = await Target.findOne({ name: targetName });
  const research = await Research.updateOne({
    _id: researchId, target: target._id, concluded: false
  }, { concluded: true, value: note, comment })

  return res.json(research)
}

export default createApiHandler({
  PUT: concludeResearch
})
