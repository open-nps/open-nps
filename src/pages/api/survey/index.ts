import { NextApiRequest, NextApiResponse } from 'next';

import { createApiHandler } from '~/util/api';
import Survey, { ISurvey } from '~/model/Survey';
import Target, { ITarget } from '~/model/Target';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';

export const createNewSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { reviewer, tags, targetName } = req.body;
  const target: ITarget = await Target.findOne({ name: targetName });

  const survey: ISurvey = await Survey.create({
    target: target._id,
    tags,
    reviewer,
  });

  return res.json(survey);
};

export default createApiHandler({
  POST: authMiddleware([RoleEnum.SURVEY_WRITE], createNewSurvey),
});
