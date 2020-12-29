jest.mock('mongoose');
jest.mock('../../../src/model');

import mongoose from 'mongoose';
import { connectMongo } from '~/util/mongo';

describe('/util/mongo', () => {
  it('should exec AddThemeOptsDefaults properly', async () => {
    const fakeVal = 'foo';
    (mongoose.connect as jest.Mock).mockResolvedValue(fakeVal);

    expect(await connectMongo()).toBe(fakeVal);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/open-nps',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });
});
