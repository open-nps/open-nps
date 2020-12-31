jest.mock('../../../../src/model/Target');

import { NextApiResponse, NextApiRequest } from 'next';

import Target from '~/model/Target';

import { findTargets, createTarget } from '~/pages/api/target';
import { findTarget, updateTarget } from '~/pages/api/target/[id]';

describe('/pages/api/target', () => {
  let req = {} as NextApiRequest;
  const res = {} as NextApiResponse;

  beforeEach(() => {
    req = {} as NextApiRequest;
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('index', () => {
    it('findTargets', async () => {
      const fakeTargets = [1, 2];
      (Target.find as jest.Mock).mockResolvedValue(fakeTargets);

      await findTargets(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ targets: fakeTargets });
    });

    it('createTarget', async () => {
      req.body = { name: 'opennps', meta: { a: 1 } };
      const fakeId = '123';
      const fakeTarget = { _id: fakeId, ...req.body };

      (Target.create as jest.Mock).mockResolvedValue(fakeTarget);

      await createTarget(req, res);

      expect(Target.create).toHaveBeenCalledTimes(1);
      expect(Target.create).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeTarget);
    });
  });

  describe('[id]', () => {
    it('findTarget', async () => {
      const fakeTarget = { name: 'opennps', meta: {} };
      req.query = { id: 'foo' };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);

      await findTarget(req, res);

      expect(Target.findOne).toHaveBeenCalledTimes(1);
      expect(Target.findOne).toHaveBeenCalledWith({ _id: req.query.id });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeTarget);
    });

    it('should updateTarget correctly', async () => {
      const newMeta = { x: 1 };
      const fakeTarget = {
        name: 'foo',
        configs: ['bar'],
        meta: {},
        updateOne: jest.fn(),
      };
      const newTarget = {
        name: fakeTarget.name,
        configs: ['fizz'],
        meta: newMeta,
      };

      req.query = { id: 'foo' };
      req.body = { configs: ['bar', 'fizz'], meta: { x: 1 } };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);

      await updateTarget(req, res);

      expect(Target.findOne).toHaveBeenCalledTimes(1);
      expect(Target.findOne).toHaveBeenCalledWith({ _id: req.query.id });
      expect(fakeTarget.updateOne).toHaveBeenCalledTimes(1);
      expect(fakeTarget.updateOne).toHaveBeenCalledWith({
        configs: ['fizz'],
        meta: { x: 1 },
      });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(newTarget);
    });

    it('should updateTarget throw 500 error', async () => {
      const fakeTarget = { values: { y: 2 }, updateOne: jest.fn() };
      req.query = { id: 'foo' };
      req.body = { name: 'foo' };
      (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);

      await updateTarget(req, res);

      expect(Target.findOne).not.toHaveBeenCalledTimes(1);
      expect(Target.findOne).not.toHaveBeenCalledWith({ _id: req.query.id });
      expect(fakeTarget.updateOne).not.toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid field to change: <name>',
      });
    });
  });
});
