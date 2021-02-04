jest.mock('../../../../src/model/Survey');
jest.mock('../../../../src/model/Target');
jest.mock('../../../../src/util/resolveHooks');

import merge from 'lodash.merge';
import { NextApiResponse, NextApiRequest } from 'next';

import Survey from '~/model/Survey';
import Target from '~/model/Target';

import { createNewSurvey } from '~/pages/api/survey';
import { concludeSurvey } from '~/pages/api/survey/conclude';
import { createResolveHooks, HookEvent } from '~/util/resolveHooks';

describe('/pages/api/survey', () => {
  let req = {} as NextApiRequest;
  const resolveHooks = jest.fn();
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
    (createResolveHooks as jest.Mock).mockResolvedValue(resolveHooks);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('index', () => {
    const primaryBody = { reviewer: fakeReviewer, targetName, tags: [1] };

    it('should createNewSurvey back a new survey with a new reviewer', async () => {
      const survey = {
        ...fakeSurvey,
        hookFormat: jest.fn().mockReturnValue(fakeSurvey),
      };
      req.body = { ...primaryBody };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);
      (Survey.create as jest.Mock).mockResolvedValue(survey);

      await createNewSurvey(req, res);

      expect(Target.findOne).toHaveBeenCalledTimes(1);
      expect(Target.findOne).toHaveBeenCalledWith({ name: targetName });
      expect(survey.hookFormat).toHaveBeenCalledWith({ target: fakeTarget });
      expect(resolveHooks).toHaveBeenCalledTimes(1);
      expect(resolveHooks).toHaveBeenCalledWith(
        HookEvent.ON_NEW_SURVEY,
        fakeSurvey
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(survey);
    });
  });

  describe('conclude', () => {
    it('should concludeSurvey throw for missing note', async () => {
      req.body = { comment: '', surveyId: fakeSurveyId };
      await concludeSurvey(req, res);

      expect(Survey.findOne).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ missing: 'note' });
    });

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
        target: fakeTarget,
        updateOne: jest.fn().mockResolvedValue(updatedSurvey),
        hookFormat: jest.fn().mockReturnValue(updatedSurvey),
      };

      req.body = { note, comment, surveyId: fakeSurveyId };
      (Survey.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(survey),
      });

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
      expect(survey.hookFormat).toHaveBeenCalledTimes(2);
      expect(survey.hookFormat).toHaveBeenNthCalledWith(2, {
        concluded: true,
        note,
        comment,
      });
      expect(resolveHooks).toHaveBeenCalledTimes(2);
      expect(resolveHooks).toHaveBeenNthCalledWith(
        1,
        HookEvent.ON_SUBMIT,
        updatedSurvey
      );
      expect(resolveHooks).toHaveBeenNthCalledWith(
        2,
        HookEvent.ON_SUCCESS,
        updatedSurvey
      );
    });
  });
});
