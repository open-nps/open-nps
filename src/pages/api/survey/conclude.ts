import Survey, { ISurvey } from '~/model/Survey';
import Hook from '~/model/Hook';

import { createApiHandler } from '~/util/api';
import { NextApiRequest, NextApiResponse } from 'next';

export const concludeSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { note, comment, surveyId } = req.body;

  const survey: ISurvey = await Survey.findOne({
    _id: surveyId,
    concluded: false,
  }).populate('target');

  const hooks = await Hook.findByTargetMappedByEvent(survey.target as string);

  try {
    await Promise.all(
      hooks.ON_SUBMIT.urls.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(survey.hookFormat()),
        })
      )
    );
  } catch (e) {
    // @TODO: Something with error
  }

  const mod = { concluded: true, note, comment };
  const response = await survey.updateOne(mod);

  try {
    await Promise.all(
      hooks.ON_SUCCESS.urls.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(survey.hookFormat(mod)),
        })
      )
    );
  } catch (e) {
    // @TODO: Something with error
  }

  return res.json(response);
};

export default createApiHandler({
  PUT: concludeSurvey,
});
