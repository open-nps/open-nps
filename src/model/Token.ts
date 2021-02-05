import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IToken extends Document {
  hash: string;
  user: string | IUser;
}

export const TokenSchema = new Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Token ||
  mongoose.model<IToken>('Token', TokenSchema)) as Model<IToken>;
