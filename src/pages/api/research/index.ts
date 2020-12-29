import { NextApiRequest, NextApiResponse } from 'next';

import { createApiHandler } from '~/util/api';
import Research, { IResearch } from '~/model/Research';
import Target, { ITarget } from '~/model/Target';
import Reviewer, { IReviewer } from '~/model/Reviewer';

export const createNewResearch = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { reviewerId, reviewerMeta, targetName } = req.body;
  const target: ITarget = await Target.findOne({ name: targetName });
  const savedReviewer: IReviewer = await Reviewer.findOne({
    uniqueIdentifier: reviewerId,
  });
  const reviewer = !savedReviewer
    ? await new Reviewer({
        uniqueIdentifier: reviewerId,
        meta: reviewerMeta,
      }).save()
    : await savedReviewer.updateOne({
        meta: { ...savedReviewer.meta, ...reviewerMeta },
      });

  const research: IResearch = new Research({
    target: target._id,
    reviewer: reviewer._id,
  });

  return res.json(await research.save());
};

export default createApiHandler({
  POST: createNewResearch,
});
