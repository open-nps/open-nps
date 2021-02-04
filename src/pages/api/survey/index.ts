import { NextApiRequest, NextApiResponse } from 'next';

import { createApiHandler } from '~/util/api';
import Survey, { ISurvey } from '~/model/Survey';
import Target, { ITarget } from '~/model/Target';
import { authMiddleware, RoleEnum } from '~/util/authMiddleware';
import { createResolveHooks, HookEvent } from '~/util/resolveHooks';
import { LoggerNamespace } from '~/util/logger';

export const createNewSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const logger = LoggerNamespace('createNewSurvey');

  logger('http', 'Enter', { body: req.body });
  const { targetName, ...otherProps } = req.body;
  const target: ITarget = await Target.findOne({ name: targetName });

  logger('debug', 'Target', target);
  const resolveHooks = await createResolveHooks(target._id);

  const survey: ISurvey = await Survey.create({
    target: target._id,
    ...otherProps,
  });

  logger('debug', 'pre-hook', {
    event: HookEvent.ON_NEW_SURVEY,
    survey: survey.hookFormat({ target }),
  });
  await resolveHooks(HookEvent.ON_NEW_SURVEY, survey.hookFormat({ target }));

  logger('http', 'Out');
  return res.json(survey);
};

export default createApiHandler({
  POST: authMiddleware([RoleEnum.SURVEY_WRITE], createNewSurvey),
});
