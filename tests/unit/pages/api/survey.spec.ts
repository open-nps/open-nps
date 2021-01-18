jest.mock('../../../../src/model/Survey');
jest.mock('../../../../src/model/Target');

import merge from 'lodash.merge';
import { NextApiResponse, NextApiRequest } from 'next';

import Survey from '~/model/Survey';
import Target from '~/model/Target';

import { createNewSurvey } from '~/pages/api/survey';
import { concludeSurvey } from '~/pages/api/survey/conclude';

describe('/pages/api/survey', () => {
  let req = {} as NextApiRequest;
  const res = {} as NextApiResponse;
  const fakeTargetId = 'bar';
  const fakeSurveyId = 'foobar';
  const fakeReviewer = { id: '1', name: 'foo' };
  const targetName = 'open-nps';
  const fakeTarget = { _id: fakeTargetId, name: targetName, meta: {} };
  const fakeSurveyData = { target: fakeTargetId, reviewer: fakeReviewer };
  const fakeSurvey = {
    _id: fakeSurveyId,
    ...fakeSurveyData,
    concluded: false,
  };

  beforeEach(() => {
    req = {} as NextApiRequest;
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('index', () => {
    const primaryBody = { reviewer: fakeReviewer, targetName, tags: [1] };

    it('should createNewSurvey back a new survey with a new reviewer', async () => {
      req.body = { ...primaryBody };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);
      (Survey.create as jest.Mock).mockResolvedValue(fakeSurvey);

      await createNewSurvey(req, res);

      expect(Target.findOne).toHaveBeenCalledTimes(1);
      expect(Target.findOne).toHaveBeenCalledWith({ name: targetName });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeSurvey);
    });
  });

  describe('conclude', () => {
    it('should concludeSurvey correctly', async () => {
      const note = 10;
      const comment = 'foo bar';
      const updatedSurvey = merge(fakeSurvey, {
        concluded: true,
        note,
        comment,
      });
      const survey = {
        ...fakeSurvey,
        updateOne: jest.fn().mockResolvedValue(updatedSurvey),
      };

      req.body = { note, comment, surveyId: fakeSurveyId };
      (Survey.findOne as jest.Mock).mockResolvedValue(survey);

      await concludeSurvey(req, res);

      expect(Survey.findOne).toHaveBeenCalledTimes(1);
      expect(Survey.findOne).toHaveBeenCalledWith({
        _id: fakeSurveyId,
        concluded: false,
      });
      expect(survey.updateOne).toHaveBeenCalledTimes(1);
      expect(survey.updateOne).toHaveBeenCalledWith({
        concluded: true,
        note,
        comment,
      });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(updatedSurvey);
    });
  });
});
