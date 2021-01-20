jest.mock('uuid');
jest.mock('../../../../src/model/Token');
jest.mock('../../../../src/model/User');

import { NextApiResponse, NextApiRequest } from 'next';
import { v4 as uuid } from 'uuid';

import Token from '~/model/Token';
import User from '~/model/User';

import { removeToken, createToken } from '~/pages/api/token';

describe('/pages/api/token', () => {
  let req = {} as NextApiRequest;
  const res = {} as NextApiResponse;
  const fakeTokenHeader = 'foobar';
  const fakeUser = { _id: 'fizzfuzz' };
  const fakeToken = { hash: 'fake-hash', user: fakeUser._id };

  beforeEach(() => {
    req = { query: {}, headers: {} } as NextApiRequest;
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
    (uuid as jest.Mock).mockReturnValue(fakeToken.hash);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should createToken using email and password', async () => {
    req.body = { email: 'foo', password: 'bar' };
    (User.findByEmailAndPassword as jest.Mock).mockResolvedValue(fakeUser);
    (Token.create as jest.Mock).mockResolvedValue(fakeToken);

    await createToken(req, res);

    expect(Token.create).toHaveBeenCalledTimes(1);
    expect(Token.create).toHaveBeenCalledWith(fakeToken);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(fakeToken);
  });

  it('should createToken using auth user', async () => {
    const populate = jest.fn().mockResolvedValue({ user: fakeUser });

    req.body = {};
    req.headers.authorization = fakeTokenHeader;

    (User.findByEmailAndPassword as jest.Mock).mockResolvedValue(null);
    (Token.findOne as jest.Mock).mockReturnValue({ populate });
    (Token.create as jest.Mock).mockResolvedValue(fakeToken);

    await createToken(req, res);

    expect(User.findByEmailAndPassword).not.toHaveBeenCalledTimes(1);
    expect(Token.findOne).toHaveBeenCalledTimes(1);
    expect(Token.findOne).toHaveBeenCalledWith({ hash: fakeTokenHeader });
    expect(populate).toHaveBeenCalledTimes(1);
    expect(populate).toHaveBeenCalledWith('user');
    expect(Token.create).toHaveBeenCalledTimes(1);
    expect(Token.create).toHaveBeenCalledWith(fakeToken);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(fakeToken);
  });

  it('should createToken 404 when missing credentials for email/password', async () => {
    req.body = { email: 'foo', password: 'bar' };
    (User.findByEmailAndPassword as jest.Mock).mockResolvedValue(null);

    await createToken(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'credentials fail' });
  });

  it('should createToken 404 when invalid token appears', async () => {
    const populate = jest.fn().mockResolvedValue(null);

    req.body = {};
    req.headers.authorization = fakeTokenHeader;
    (Token.findOne as jest.Mock).mockReturnValue({ populate });

    await createToken(req, res);

    expect(Token.findOne).toHaveBeenCalledTimes(1);
    expect(Token.findOne).toHaveBeenCalledWith({ hash: fakeTokenHeader });
    expect(populate).toHaveBeenCalledTimes(1);
    expect(populate).toHaveBeenCalledWith('user');
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'credentials fail' });
  });

  it('should removeToken properly', async () => {
    req.headers.authorization = fakeTokenHeader;

    (Token.deleteOne as jest.Mock).mockResolvedValue({});

    await removeToken(req, res);

    expect(Token.deleteOne).toHaveBeenCalledTimes(1);
    expect(Token.deleteOne).toHaveBeenCalledWith({
      hash: req.headers.authorization,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});
