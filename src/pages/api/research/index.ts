import { NextApiRequest, NextApiResponse } from "next";

import { createApiHandler } from "../../../util/api"
import { connectMongo } from "../../../util/mongo"
import { Reviewer, Research, Target } from '../../../model';
import { IReviewer } from "../../../model/Reviewer";

export const createNewResearch = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectMongo();

  const { reviewerId, reviewerMeta, targetName } = req.body;
  const target = await Target.findOne({ name: targetName });
  const savedReviewer: IReviewer = await Reviewer.findOne({ uniqueIdentifier: reviewerId });
  const reviewer = !savedReviewer
    ? await (new Reviewer({ uniqueIdentifier: reviewerId, meta: reviewerMeta })).save()
    : await savedReviewer.updateOne({ meta: { ...savedReviewer.meta, ...reviewerMeta } })

  const research = new Research({
    target: target._id,
    reviewer: reviewer._id
  });

  return res.json(await research.save());
}

export default createApiHandler({
  POST: createNewResearch
});
