import { NextApiRequest, NextApiResponse } from 'next';

import { createApiHandler } from '~/util/api';
import Survey, { ISurvey } from '~/model/Survey';
import Target, { ITarget } from '~/model/Target';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { createResolveHooks, HookEvent } from '~/util/resolveHooks';

export const createNewSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { targetName, ...otherProps } = req.body;
  const target: ITarget = await Target.findOne({ name: targetName });
  const resolveHooks = await createResolveHooks(target._id);

  const survey: ISurvey = await Survey.create({
    target: target._id,
    ...otherProps,
  });

  await resolveHooks(HookEvent.ON_NEW_SURVEY, survey.hookFormat({ target }));

  return res.json(survey);
};

export default createApiHandler({
  POST: authMiddleware([RoleEnum.SURVEY_WRITE], createNewSurvey),
});
