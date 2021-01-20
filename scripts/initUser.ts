#!/bin/bash
import mongoose from 'mongoose';
import User, { Role } from '../src/model/User';

export default async () => {
  await mongoose.connect(process.env.MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const userCount = await User.countDocuments();

  if (userCount !== 0) {
    return;
  }

  return await User.create({
    email: 'admin@open.nps',
    password: 'opennps123',
    roles: Role,
  });
};
