jest.mock('../../../src/model/Tag');

import dateformat from 'dateformat';
import Tag from '../../../src/model/Tag';
import { getOverrideConfigs, hookFormat } from '../../../src/model/Survey';

describe('src/model/Survey', () => {
  it('should exec getOverrideConfigs properly', async () => {
    const fakeTags = 'foo';
    const vals = [1, 2];
    const populate = jest
      .fn()
      .mockResolvedValue([
        { overrideConfigs: vals[0] },
        { overrideConfigs: vals[1] },
      ]);

    (Tag.find as jest.Mock).mockReturnValue({ populate });
    const resp = await getOverrideConfigs.apply({ tags: fakeTags });

    expect(resp).toEqual(vals);
    expect(Tag.find).toHaveBeenCalledTimes(1);
    expect(Tag.find).toHaveBeenCalledWith({ name: { $in: fakeTags } });
  });

  it('should exec hookFormat properly', async () => {
    const mod = { a: 1 };
    const doc = {
      _id: '123',
      target: 'foo',
      meta: 'bar',
      reviewer: 'foobar',
      tags: 'fizz',
      note: 'fuzz',
      concluded: 'fizzfuzz',
      comment: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const overrideDates = {
      createdAt: dateformat(doc.createdAt, 'yyyy-mm-dd HH:MM:ss'),
      updatedAt: dateformat(doc.updatedAt, 'yyyy-mm-dd HH:MM:ss'),
    };

    expect(hookFormat.apply(doc, [mod])).toEqual({
      ...doc,
      ...mod,
      ...overrideDates,
    });
    expect(hookFormat.apply(doc, [])).toEqual({ ...doc, ...overrideDates });
  });
});
