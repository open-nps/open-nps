jest.mock('../../../src/util/mongo');

import { createApiHandler } from '~/util/api';
import { connectMongo } from '~/util/mongo';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/util/api', () => {
  it('should create render properly', async () => {
    const fakeResponse = 'foo';
    const fakeHandler = jest.fn();

    fakeHandler.mockReturnValue(fakeResponse);
    (connectMongo as jest.Mock).mockResolvedValue({});

    const handler = createApiHandler({ GET: fakeHandler });
    const req = { method: 'GET' } as unknown;
    const res = {} as unknown;

    expect(await handler(req as NextApiRequest, res as NextApiResponse)).toBe(
      fakeResponse
    );
    expect(fakeHandler).toHaveBeenCalledTimes(1);
    expect(fakeHandler).toHaveBeenCalledWith(req, res);
  });
});
