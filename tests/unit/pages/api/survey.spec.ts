jest.mock('../../../../src/model/Survey');
jest.mock('../../../../src/model/Target');
jest.mock('../../../../src/model/Hook');

import merge from 'lodash.merge';
import { NextApiResponse, NextApiRequest } from 'next';

import Survey from '~/model/Survey';
import Target from '~/model/Target';
import Hook, { HookEvent } from '~/model/Hook';

import { createNewSurvey } from '~/pages/api/survey';
import { concludeSurvey } from '~/pages/api/survey/conclude';

describe('/pages/api/survey', () => {
  const fetch = global.fetch;
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
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = fetch;
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
        target: fakeTarget,
        updateOne: jest.fn().mockResolvedValue(updatedSurvey),
        hookFormat: jest.fn().mockReturnValue(updatedSurvey),
      };
      const fakeOnSubmitHookUrls = ['foo.bar'];
      const fakeOnSuccessHookUrls = ['foo.bar'];
      const fakeHooks = {
        [HookEvent.ON_SUBMIT]: {
          urls: fakeOnSubmitHookUrls,
        },
        [HookEvent.ON_SUCCESS]: {
          urls: fakeOnSuccessHookUrls,
        },
      };

      req.body = { note, comment, surveyId: fakeSurveyId };
      (Survey.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(survey),
      });
      (Hook.findByTargetMappedByEvent as jest.Mock).mockResolvedValue(
        fakeHooks
      );
      (global.fetch as jest.Mock).mockResolvedValue({});

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
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, fakeOnSubmitHookUrls[0], {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSurvey),
      });
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        fakeOnSuccessHookUrls[0],
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSurvey),
        }
      );
    });
  });
});
