jest.mock('../../../src/model/Hook');
jest.mock('../../../src/util/logger');

import { createResolveHooks } from '~/util/resolveHooks';
import Hook, { HookEvent } from '~/model/Hook';
import { LoggerNamespace } from '~/util/logger';

describe('src/util/resolveHooks', () => {
  const fetch = global.fetch;
  const fakeTarget = 'opennps';
  const fakeInput = { foo: 'bar' };
  const fakeOutput = { ok: true, fizz: 'fuzz' };
  const logger = jest.fn();

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

  beforeEach(() => {
    (LoggerNamespace as jest.Mock).mockReturnValue(logger);
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

    expect(LoggerNamespace).toHaveBeenCalledTimes(1);
    expect(LoggerNamespace).toHaveBeenCalledWith('HookResolver');
    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith('debug', 'will-start', {
      key: HookEvent.ON_SUBMIT,
      data: fakeInput,
    });
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

  it('should log problem if response not okey', async () => {
    const fakeError = 'Foo Error';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: jest.fn().mockResolvedValue(fakeError),
    });
    (Hook.findByTargetMappedByEvent as jest.Mock).mockResolvedValue(fakeHooks);

    const resolve = await createResolveHooks(fakeTarget);
    const response = await resolve(HookEvent.ON_SUBMIT, fakeInput);

    expect(LoggerNamespace).toHaveBeenCalledTimes(1);
    expect(LoggerNamespace).toHaveBeenCalledWith('HookResolver');
    expect(logger).toHaveBeenCalledTimes(2);
    expect(logger).toHaveBeenNthCalledWith(1, 'debug', 'will-start', {
      key: HookEvent.ON_SUBMIT,
      data: fakeInput,
    });
    expect(logger).toHaveBeenNthCalledWith(2, 'error', 'Error', {
      key: HookEvent.ON_SUBMIT,
      error: new Error(fakeError).toString(),
    });
    expect(Hook.findByTargetMappedByEvent).toHaveBeenCalledTimes(1);
    expect(Hook.findByTargetMappedByEvent).toHaveBeenCalledWith(fakeTarget);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      fakeHooks[HookEvent.ON_SUBMIT].urls[0],
      fetchOptsPrepare(fakeInput)
    );
    expect(response).not.toEqual([fakeOutput]);
  });

  it('should log problem if fetch reject', async () => {
    const fakeError = 'Foo Error';
    (global.fetch as jest.Mock).mockRejectedValue(fakeError);
    (Hook.findByTargetMappedByEvent as jest.Mock).mockResolvedValue(fakeHooks);

    const resolve = await createResolveHooks(fakeTarget);
    const response = await resolve(HookEvent.ON_SUBMIT, fakeInput);

    expect(LoggerNamespace).toHaveBeenCalledTimes(1);
    expect(LoggerNamespace).toHaveBeenCalledWith('HookResolver');
    expect(logger).toHaveBeenCalledTimes(2);
    expect(logger).toHaveBeenNthCalledWith(1, 'debug', 'will-start', {
      key: HookEvent.ON_SUBMIT,
      data: fakeInput,
    });
    expect(logger).toHaveBeenNthCalledWith(2, 'error', 'Error', {
      key: HookEvent.ON_SUBMIT,
      error: fakeError,
    });
    expect(Hook.findByTargetMappedByEvent).toHaveBeenCalledTimes(1);
    expect(Hook.findByTargetMappedByEvent).toHaveBeenCalledWith(fakeTarget);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      fakeHooks[HookEvent.ON_SUBMIT].urls[0],
      fetchOptsPrepare(fakeInput)
    );
    expect(response).not.toEqual([fakeOutput]);
  });
});
