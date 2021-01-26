jest.mock('../../../src/model/Hook');

import { createResolveHooks } from '~/util/resolveHooks';
import Hook, { HookEvent } from '~/model/Hook';

describe('src/util/resolveHooks', () => {
  const fetch = global.fetch;
  const fakeTarget = 'opennps';
  const fakeInput = { foo: 'bar' };
  const fakeOutput = { fizz: 'fuzz' };

  const fakeHooks = {
    [HookEvent.ON_SUBMIT]: {
      urls: ['foo'],
    },
  };

  const fetchOptsPrepare = (data: AnyObject) => ({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = fetch;
  });

  it('should resolve hooks properly', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(fakeOutput);
    (Hook.findByTargetMappedByEvent as jest.Mock).mockResolvedValue(fakeHooks);

    const resolve = await createResolveHooks(fakeTarget);
    const response = await resolve(HookEvent.ON_SUBMIT, fakeInput);

    expect(Hook.findByTargetMappedByEvent).toHaveBeenCalledTimes(1);
    expect(Hook.findByTargetMappedByEvent).toHaveBeenCalledWith(fakeTarget);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      fakeHooks[HookEvent.ON_SUBMIT].urls[0],
      fetchOptsPrepare(fakeInput)
    );
    expect(response).toEqual([fakeOutput]);
  });
});
