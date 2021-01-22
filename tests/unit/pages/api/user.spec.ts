jest.mock('../../../../src/model/User');

import { NextApiResponse, NextApiRequest } from 'next';

import User, { RoleEnum } from '~/model/User';

import { findUsers, createUser } from '~/pages/api/user';
import { findUser, updateUser, deleteUser } from '~/pages/api/user/[id]';

import { advanceTo, clear } from 'jest-date-mock';

describe('/pages/api/user', () => {
  let req = {} as NextApiRequest;
  const res = {} as NextApiResponse;

  beforeEach(() => {
    req = { query: {} } as NextApiRequest;
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
  });

  afterEach(() => {
    jest.resetAllMocks();
    clear();
  });

  describe('index', () => {
    it('findUsers', async () => {
      const fakeUsers = [1, 2];
      (User.find as jest.Mock).mockResolvedValue(fakeUsers);

      await findUsers(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ users: fakeUsers });
    });

    it('createUser', async () => {
      req.body = { email: 'foo', password: 'bar' };
      const fakeId = '123';
      const fakeUser = { _id: fakeId, ...req.body };

      (User.create as jest.Mock).mockResolvedValue(fakeUser);

      await createUser(req, res);

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });
  });

  describe('[id]', () => {
    it('findUser', async () => {
      const fakeUser = { a: 1 };
      req.query = { id: 'foo' };
      (User.findOne as jest.Mock).mockResolvedValue(fakeUser);

      await findUser(req, res);

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.query.id });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });

    it('should updateUser correctly', async () => {
      const oldRoles = [RoleEnum.SETUP_WRITE];
      const newRoles = [RoleEnum.SETUP_READ];
      const fakeUser = {
        roles: oldRoles,
        updateOne: jest.fn().mockResolvedValue({}),
      };
      const finalUser = {
        ...fakeUser,
        roles: newRoles,
      };

      req.query = { id: 'foo' };
      req.body = { roles: [...oldRoles, ...newRoles] };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await updateUser(req, res);

      expect(User.findById).toHaveBeenCalledTimes(1);
      expect(User.findById).toHaveBeenCalledWith(req.query.id);
      expect(fakeUser.updateOne).toHaveBeenCalledTimes(1);
      expect(fakeUser.updateOne).toHaveBeenCalledWith({ roles: newRoles });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(finalUser);
    });

    it('should exec deleteUser properly', async () => {
      const deletedAt = new Date();
      const fakeTarget = { values: { y: 2 }, deletedAt };

      advanceTo(deletedAt);
      req.query = { id: 'foo' };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(fakeTarget);
      await deleteUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.query.id,
        { deletedAt },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(fakeTarget);
    });
  });
});
