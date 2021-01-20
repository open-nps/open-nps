import {
  findByEmailAndPassword,
  hashPassword,
  preSave,
} from '../../../src/model/User';

describe('src/model/User', () => {
  const originalPass = 'foobar';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should exec findByEmailAndPassword properly', async () => {
    const fakeReturn = 'fizzfuzz';
    const email = 'foo';
    const password = 'bar';
    const findOne = jest.fn().mockReturnValue(fakeReturn);

    expect(findByEmailAndPassword.apply({ findOne }, [email, password])).toBe(
      fakeReturn
    );
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledWith({
      email,
      password: hashPassword(password),
    });
  });

  it('should exec preSave and edit password when document isNew, isModified false', async () => {
    const doc = {
      isNew: true,
      password: originalPass,
      isModified: jest.fn().mockReturnValue(false),
    };

    preSave.apply(doc);

    expect(doc.password).toBe(hashPassword(originalPass));
    expect(doc.isModified).not.toHaveBeenCalledTimes(1);
    expect(doc.isModified).not.toHaveBeenCalledWith('password');
  });

  it('should exec preSave and edit password when document isNew false, isModified true', async () => {
    const doc = {
      isNew: false,
      password: originalPass,
      isModified: jest.fn().mockReturnValue(true),
    };

    preSave.apply(doc);

    expect(doc.password).toBe(hashPassword(originalPass));
    expect(doc.isModified).toHaveBeenCalledTimes(1);
    expect(doc.isModified).toHaveBeenCalledWith('password');
  });

  it('should exec preSave and edit password when document isNew false, isModified false', async () => {
    const doc = {
      isNew: false,
      password: originalPass,
      isModified: jest.fn().mockReturnValue(false),
    };

    preSave.apply(doc);

    expect(doc.password).toBe(doc.password);
    expect(doc.isModified).toHaveBeenCalledTimes(1);
    expect(doc.isModified).toHaveBeenCalledWith('password');
  });
});
