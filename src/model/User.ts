import crypto from 'crypto';
import mongoose, { Schema, Document, Model } from 'mongoose';
import timestamp from 'mongoose-timestamp';

export const hashPassword = (value: string): string =>
  crypto.createHash('sha256').update(value).digest('hex');

export enum RoleEnum {
  USER_READ = 'USER_READ',
  USER_WRITE = 'USER_WRITE',
  USER_UPDATE = 'USER_UPDATE',
  SETUP_READ = 'SETUP_READ',
  SETUP_WRITE = 'SETUP_WRITE',
  TAG_READ = 'TAG_READ',
  TAG_WRITE = 'TAG_WRITE',
  SURVEY_WRITE = 'SURVEY_WRITE',
  METRICS = 'METRICS',
}

export const Role = [
  RoleEnum.USER_READ,
  RoleEnum.USER_WRITE,
  RoleEnum.USER_UPDATE,
  RoleEnum.SETUP_READ,
  RoleEnum.SETUP_WRITE,
  RoleEnum.TAG_READ,
  RoleEnum.TAG_WRITE,
  RoleEnum.SURVEY_WRITE,
  RoleEnum.METRICS,
] as const;

export interface IUser extends Document {
  email: string;
  password: string;
  roles: typeof Role[number][];
  token: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface UserModel extends Model<IUser> {
  findByEmailAndPassword(email: string, password: string): Promise<IUser>;
}

export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      enum: Role,
    },
  ],
  deletedAt: {
    type: Date,
  },
});

UserSchema.plugin(timestamp);

export function findByEmailAndPassword(
  this: UserModel,
  email: string,
  password: string
): Promise<IUser> {
  return this.findOne({ email, password: hashPassword(password) });
}

export function preSave(this: IUser): void {
  if (this.isNew || this.isModified('password')) {
    this.password = hashPassword(this.password);
  }
}

UserSchema.static('findByEmailAndPassword', findByEmailAndPassword);
UserSchema.pre('save', preSave);

export default (mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema)) as UserModel;
