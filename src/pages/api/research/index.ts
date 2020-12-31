import merge from 'lodash.merge';
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
  const finalReviewerMeta = !savedReviewer
    ? reviewerMeta
    : merge(savedReviewer.meta, reviewerMeta);
  const reviewer = !savedReviewer
    ? await Reviewer.create({
        uniqueIdentifier: reviewerId,
        meta: finalReviewerMeta,
      })
    : await savedReviewer
        .updateOne({
          meta: finalReviewerMeta,
        })
        .then(() => merge(savedReviewer, { meta: finalReviewerMeta }));

  const research: IResearch = await Research.create({
    target: target._id,
    reviewer: reviewer._id,
  });

  return res.json(research);
};

export default createApiHandler({
  POST: createNewResearch,
});
