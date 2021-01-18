jest.mock('../../../../src/model/Tag');

import { NextApiResponse, NextApiRequest } from 'next';

import Tag from '~/model/Tag';

import { findTags, createTag } from '~/pages/api/tag';
import { findTag, updateTag, deleteTag } from '~/pages/api/tag/[id]';

import { advanceTo, clear } from 'jest-date-mock';

describe('/pages/api/tag', () => {
  let req = {} as NextApiRequest;
  const res = {} as NextApiResponse;

  beforeEach(() => {
    req = { query: {} } as NextApiRequest;
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    jest.resetAllMocks();
    clear();
  });

  describe('index', () => {
    it('findTags', async () => {
      const fakeTags = [1, 2];
      (Tag.find as jest.Mock).mockResolvedValue(fakeTags);

      await findTags(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ tags: fakeTags });
    });

    it('createTag', async () => {
      req.body = { name: 'npsday', overrideConfigs: [] };
      const fakeId = '123';
      const fakeTag = { _id: fakeId, ...req.body };

      (Tag.create as jest.Mock).mockResolvedValue(fakeTag);

      await createTag(req, res);

      expect(Tag.create).toHaveBeenCalledTimes(1);
      expect(Tag.create).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeTag);
    });
  });

  describe('[id]', () => {
    it('findTag', async () => {
      const fakeTag = { name: 'npsday', overrideConfigs: {} };
      req.query = { id: 'foo' };
      (Tag.findOne as jest.Mock).mockResolvedValue(fakeTag);

      await findTag(req, res);

      expect(Tag.findOne).toHaveBeenCalledTimes(1);
      expect(Tag.findOne).toHaveBeenCalledWith({ _id: req.query.id });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeTag);
    });

    it('should updateTag correctly', async () => {
      const newMeta = { x: 1 };
      const fakeTag = {
        name: 'foo',
        overrideConfigs: ['bar'],
        updateOne: jest.fn(),
      };
      const newTag = {
        name: fakeTag.name,
        overrideConfigs: ['fizz'],
      };

      req.query = { id: 'foo' };
      req.body = { overrideConfigs: ['bar', 'fizz'], meta: { x: 1 } };
      (Tag.findOne as jest.Mock).mockResolvedValue(fakeTag);

      await updateTag(req, res);

      expect(Tag.findOne).toHaveBeenCalledTimes(1);
      expect(Tag.findOne).toHaveBeenCalledWith({ _id: req.query.id });
      expect(fakeTag.updateOne).toHaveBeenCalledTimes(1);
      expect(fakeTag.updateOne).toHaveBeenCalledWith({
        overrideConfigs: newTag.overrideConfigs,
      });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(newTag);
    });

    it('should updateTarget throw 500 error', async () => {
      req.query = { id: 'foo' };
      req.body = { name: 'foo' };

      await updateTag(req, res);

      expect(Tag.findOne).not.toHaveBeenCalledTimes(1);
      expect(Tag.findOne).not.toHaveBeenCalledWith({ _id: req.query.id });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid field to change: <name>',
      });
    });

    it('should exec deleteTarget properly', async () => {
      const deletedAt = new Date();
      const fakeTag = { values: { y: 2 }, updateOne: jest.fn() };

      advanceTo(deletedAt);

      req.query = { id: 'foo' };

      (Tag.findOne as jest.Mock).mockResolvedValue(fakeTag);
      await deleteTag(req, res);

      expect(Tag.findOne).toHaveBeenCalledTimes(1);
      expect(Tag.findOne).toHaveBeenCalledWith({ _id: req.query.id });
      expect(fakeTag.updateOne).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ deletedAt });
    });
  });
});
