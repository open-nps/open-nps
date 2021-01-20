jest.mock('../../../src/model/Token');

import { NextApiRequest, NextApiResponse } from 'next';

import Token from '~/model/Token';

import { authMiddleware, RoleEnum } from '~/util/authMiddleware';

describe('src/util/authMiddleware', () => {
  const req = {} as NextApiRequest;
  const res = {} as NextApiResponse;
  const callback = jest.fn();
  const fakeTokenWithUser = { user: { roles: [RoleEnum.TAG_READ] } };
  const mockTokenGetPopulate = (token) => {
    const populate = jest.fn().mockResolvedValue(token);
    (Token.findOne as jest.Mock).mockReturnValue({ populate });
    return populate;
  };

  const baseAssert = ({ populate, statusCode = null, message = null }) => {
    expect(populate).toHaveBeenCalledTimes(1);
    expect(populate).toHaveBeenCalledWith('user');
    expect(Token.findOne).toHaveBeenCalledTimes(1);
    expect(Token.findOne).toHaveBeenCalledWith({
      hash: req.headers.authorization,
    });

    if (statusCode && message) {
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ authorization: 'denied' });
    } else {
      expect(res.status).not.toHaveBeenCalledWith(403);
      expect(res.json).not.toHaveBeenCalledWith({ authorization: 'denied' });
    }
  };

  const baseAssertFor403 = (populate) =>
    baseAssert({
      populate,
      statusCode: 403,
      message: { authorization: 'denied' },
    });

  beforeEach(() => {
    req.headers = { authorization: null };
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 403 denied for missing header in request', async () => {
    const populate = mockTokenGetPopulate(null);
    const middleware = authMiddleware([RoleEnum.SETUP_READ], callback);

    await middleware(req, res);
    baseAssertFor403(populate);
  });

  it('should return 403 denied for wrong hash (non-existent token)', async () => {
    req.headers.authorization = 'some hash';
    const populate = mockTokenGetPopulate(null);
    const middleware = authMiddleware([RoleEnum.SETUP_READ], callback);

    await middleware(req, res);
    baseAssertFor403(populate);
  });

  it('should return 403 denied for not allowed role', async () => {
    req.headers.authorization = 'some hash';
    const populate = mockTokenGetPopulate(fakeTokenWithUser);
    const middleware = authMiddleware([RoleEnum.SETUP_READ], callback);

    await middleware(req, res);
    baseAssertFor403(populate);
  });

  it('should return 403 denied for not allowed roles (multiple requested)', async () => {
    req.headers.authorization = 'some hash';
    const populate = mockTokenGetPopulate(fakeTokenWithUser);
    const middleware = authMiddleware(
      [RoleEnum.TAG_READ, RoleEnum.TAG_WRITE],
      callback
    );

    await middleware(req, res);
    baseAssertFor403(populate);
  });

  it('should return callback for successfuly authentication with token', async () => {
    req.headers.authorization = 'some hash';
    const populate = mockTokenGetPopulate(fakeTokenWithUser);
    const middleware = authMiddleware([RoleEnum.TAG_READ], callback);

    await middleware(req, res);
    baseAssert({ populate });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(req, res);
  });

  it('should return callback for successfuly authentication for no roles required', async () => {
    const populate = mockTokenGetPopulate(null);
    const middleware = authMiddleware([], callback);

    await middleware(req, res);
    baseAssert({ populate });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(req, res);
  });
});
