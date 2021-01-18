import { addOrPop } from '~/util/addOrPop';

describe('/util/addOrPop', () => {
  it('should exec properly with l1 greater length than l1', () => {
    const newValues = ['bar', 'fizz'];
    const l2 = ['foo'];
    const l1 = [...l2, ...newValues];
    expect(addOrPop(l1, l2)).toEqual(newValues);
  });
});
