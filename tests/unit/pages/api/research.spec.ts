jest.mock('../../../../src/model/Research');
jest.mock('../../../../src/model/Target');
jest.mock('../../../../src/model/Reviewer');

import merge from 'lodash.merge';
import { NextApiResponse, NextApiRequest } from 'next';

import Research from '~/model/Research';
import Target from '~/model/Target';
import Reviewer from '~/model/Reviewer';

import { createNewResearch } from '~/pages/api/research';
import { concludeResearch } from '~/pages/api/research/conclude';

describe('/pages/api/research', () => {
  let req = {} as NextApiRequest;
  const res = {} as NextApiResponse;
  const fakeReviewerId = 'foo';
  const fakeTargetId = 'bar';
  const fakeResearchId = 'foobar';
  const fakeResearchData = { target: fakeTargetId, reviewer: fakeReviewerId };
  const fakeResearch = {
    _id: fakeResearchId,
    ...fakeResearchData,
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
    const reviewerId = 'foo';
    const reviewerMeta = { fizz: 'fuzz' };
    const targetName = 'open-nps';
    const primaryBody = { reviewerId, reviewerMeta, targetName };
    const fakeReviewerData = {
      meta: reviewerMeta,
      uniqueIdentifier: reviewerId,
    };
    const fakeReviewer = { _id: fakeReviewerId, ...fakeReviewerData };
    const fakeTarget = { _id: fakeTargetId, name: targetName, meta: {} };

    it('should createNewResearch back a new research with a new reviewer', async () => {
      req.body = { ...primaryBody };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);
      (Reviewer.findOne as jest.Mock).mockResolvedValue(null);
      (Reviewer.create as jest.Mock).mockResolvedValue(fakeReviewer);
      (Research.create as jest.Mock).mockResolvedValue(fakeResearch);

      await createNewResearch(req, res);

      expect(Target.findOne).toHaveBeenCalledTimes(1);
      expect(Target.findOne).toHaveBeenCalledWith({ name: targetName });
      expect(Reviewer.findOne).toHaveBeenCalledTimes(1);
      expect(Reviewer.findOne).toHaveBeenCalledWith({
        uniqueIdentifier: reviewerId,
      });
      expect(Reviewer.create).toHaveBeenCalledTimes(1);
      expect(Reviewer.create).toHaveBeenCalledWith(fakeReviewerData);
      expect(Research.create).toHaveBeenCalledTimes(1);
      expect(Research.create).toHaveBeenCalledWith(fakeResearchData);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeResearch);
    });

    it('should createNewResearch back a new research with a existent reviewer', async () => {
      const newMeta = { y: 1 };
      const updatedReviewer = merge(fakeReviewer, { meta: newMeta });
      const reviewer = {
        ...fakeReviewer,
        updateOne: jest.fn().mockResolvedValue(updatedReviewer),
      };

      req.body = { ...primaryBody, reviewerMeta: newMeta };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);
      (Reviewer.findOne as jest.Mock).mockResolvedValue(reviewer);
      (Research.create as jest.Mock).mockResolvedValue(fakeResearch);

      await createNewResearch(req, res);

      expect(Target.findOne).toHaveBeenCalledTimes(1);
      expect(Target.findOne).toHaveBeenCalledWith({ name: targetName });
      expect(Reviewer.findOne).toHaveBeenCalledTimes(1);
      expect(Reviewer.findOne).toHaveBeenCalledWith({
        uniqueIdentifier: reviewerId,
      });
      expect(Reviewer.create).not.toHaveBeenCalledTimes(1);
      expect(Reviewer.create).not.toHaveBeenCalledWith(fakeReviewerData);
      expect(reviewer.updateOne).toHaveBeenCalledTimes(1);
      expect(reviewer.updateOne).toHaveBeenCalledWith({
        meta: updatedReviewer.meta,
      });
      expect(Research.create).toHaveBeenCalledTimes(1);
      expect(Research.create).toHaveBeenCalledWith(fakeResearchData);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeResearch);
    });
  });

  describe('conclude', () => {
    it('should concludeResearch correctly', async () => {
      const note = 10;
      const comment = 'foo bar';
      const updatedResearch = merge(fakeResearch, {
        concluded: true,
        note,
        comment,
      });
      const research = {
        ...fakeResearch,
        updateOne: jest.fn().mockResolvedValue(updatedResearch),
      };

      req.body = { note, comment, researchId: fakeResearchId };
      (Research.findOne as jest.Mock).mockResolvedValue(research);

      await concludeResearch(req, res);

      expect(Research.findOne).toHaveBeenCalledTimes(1);
      expect(Research.findOne).toHaveBeenCalledWith({
        _id: fakeResearchId,
        concluded: false,
      });
      expect(research.updateOne).toHaveBeenCalledTimes(1);
      expect(research.updateOne).toHaveBeenCalledWith({
        concluded: true,
        note,
        comment,
      });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(updatedResearch);
    });
  });
});
