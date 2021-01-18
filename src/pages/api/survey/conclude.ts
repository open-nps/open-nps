import Survey, { ISurvey } from '~/model/Survey';

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
  });

  const response = await survey.updateOne({ concluded: true, note, comment });
  return res.json(response);
};

export default createApiHandler({
  PUT: concludeSurvey,
});
