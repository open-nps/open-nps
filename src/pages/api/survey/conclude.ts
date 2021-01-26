import Survey, { ISurvey } from '~/model/Survey';

import { createApiHandler } from '~/util/api';
import { createResolveHooks, HookEvent } from '~/util/resolveHooks';
import { NextApiRequest, NextApiResponse } from 'next';
import { ITarget } from '~/model/Target';

export const concludeSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { note, comment, surveyId } = req.body;

  const survey: ISurvey = await Survey.findOne({
    _id: surveyId,
    concluded: false,
  }).populate('target');

  const resolveHooks = await createResolveHooks((survey.target as ITarget)._id);

  await resolveHooks(HookEvent.ON_SUBMIT, survey.hookFormat());

  const mod = { concluded: true, note, comment };
  const response = await survey.updateOne(mod);

  await resolveHooks(HookEvent.ON_SUCCESS, survey.hookFormat(mod));

  return res.json(response);
};

export default createApiHandler({
  PUT: concludeSurvey,
});
