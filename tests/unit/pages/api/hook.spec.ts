jest.mock('uuid');
jest.mock('../../../../src/model/Hook');
jest.mock('../../../../src/model/Target');

import { NextApiResponse, NextApiRequest } from 'next';

import Hook, { HookEvent } from '~/model/Hook';
import Target from '~/model/Target';

import { createHook, updateHook, findHooks } from '~/pages/api/hook';

describe('/pages/api/hook', () => {
  const req = { query: {} } as NextApiRequest;
  const res = {} as NextApiResponse;
  const fakeId = 'foo';
  const fakeTarget = { _id: '123', name: 'opennps' };

  beforeEach(() => {
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should findHooks properly', async () => {
    const fakeHooks = [1, 2];
    const populate = jest.fn().mockResolvedValue(fakeHooks);
    (Hook.find as jest.Mock).mockReturnValue({ populate });

    await findHooks(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ hooks: fakeHooks });
  });

  it('should createHook properly', async () => {
    const urls = ['http://foo.bar/fizzfuzz'];
    const sharedProps = { event: HookEvent.ON_SUBMIT, urls };
    const fakeHook = { _id: fakeId, ...sharedProps, target: fakeTarget._id };

    req.body = { ...sharedProps, targetName: fakeTarget.name };
    (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);
    (Hook.create as jest.Mock).mockResolvedValue(fakeHook);

    await createHook(req, res);

    expect(Target.findOne).toHaveBeenCalledTimes(1);
    expect(Target.findOne).toHaveBeenCalledWith({ name: fakeTarget.name });
    expect(Hook.create).toHaveBeenCalledTimes(1);
    expect(Hook.create).toHaveBeenCalledWith({
      ...sharedProps,
      target: fakeTarget._id,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(fakeHook);
  });

  it('should updateHook properly', async () => {
    const oldUrls = ['http://foo.bar/fizzfuzz'];
    const newUrls = ['http://fizz.fuzz/foobar'];
    const sharedBodyProps = {
      event: HookEvent.ON_SUBMIT,
      urls: [...oldUrls, ...newUrls],
    };
    const sharedProps = { _id: fakeId, ...sharedBodyProps };
    const oldHook = { ...sharedProps, urls: oldUrls, updateOne: jest.fn() };
    const newHook = { ...sharedProps, target: fakeTarget._id, urls: newUrls };

    req.body = { ...sharedBodyProps, targetName: fakeTarget.name };
    (Target.findOne as jest.Mock).mockResolvedValue(fakeTarget);
    (Hook.findOne as jest.Mock).mockResolvedValue(oldHook);

    await updateHook(req, res);

    expect(Hook.findOne).toHaveBeenCalledTimes(1);
    expect(Hook.findOne).toHaveBeenCalledWith({
      event: req.body.event,
      target: fakeTarget._id,
    });
    expect(oldHook.updateOne).toHaveBeenCalledTimes(1);
    expect(oldHook.updateOne).toHaveBeenCalledWith({ urls: newUrls });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(newHook);
  });
});
