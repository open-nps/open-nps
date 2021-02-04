import Survey, { ISurvey } from '~/model/Survey';

import { createApiHandler } from '~/util/api';
import { createResolveHooks, HookEvent } from '~/util/resolveHooks';
import { NextApiRequest, NextApiResponse } from 'next';
import { ITarget } from '~/model/Target';
import { LoggerNamespace } from '~/util/logger';

export const concludeSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('concludeSurvey');
  logger('http', 'Enter', { body: req.body });

  const { note, comment, surveyId } = req.body;

  if (!note) {
    logger('http', 'Error', { missing: 'note' });
    return res.status(500).json({ missing: 'note' });
  }

  const survey: ISurvey = await Survey.findOne({
    _id: surveyId,
    concluded: false,
  }).populate('target');

  const resolveHooks = await createResolveHooks((survey.target as ITarget)._id);

  logger('debug', 'pre-hook', {
    event: HookEvent.ON_SUBMIT,
    survey: survey.hookFormat(),
  });
  await resolveHooks(HookEvent.ON_SUBMIT, survey.hookFormat());

  const mod = { concluded: true, note, comment };
  logger('debug', 'pre-update', { modification: mod });
  const response = await survey.updateOne(mod);

  logger('debug', 'pre-hook', {
    event: HookEvent.ON_SUCCESS,
    survey: survey.hookFormat(mod),
  });
  await resolveHooks(HookEvent.ON_SUCCESS, survey.hookFormat(mod));

  logger('http', 'Out');
  return res.json(response);
};

export default createApiHandler({
  PUT: concludeSurvey,
});
