import { findByTargetMappedByEvent } from '../../../src/model/Hook';

describe('src/model/Hook', () => {
  it('should exec findByTargetMappedByEvent properly', async () => {
    const fakeTargetId = 'foo';
    const hook = { event: 'bar', a: 1 };
    const doc = { find: jest.fn().mockResolvedValue([hook]) };
    const response = await findByTargetMappedByEvent.apply(doc, [fakeTargetId]);

    expect(doc.find).toHaveBeenCalledTimes(1);
    expect(doc.find).toHaveBeenCalledWith({ target: fakeTargetId });
    expect(response).toEqual({ [hook.event]: hook });
  });
});
