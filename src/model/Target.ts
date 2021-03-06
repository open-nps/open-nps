import mongoose, { Schema, Document, Model } from 'mongoose';
import { IConfig } from './Config';

export interface ITarget extends Document {
  name: string;
  configs: string[] | IConfig[];
  meta: AnyObject;
}

export const TargetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    meta: {
      type: Object,
      default: {},
    },
    configs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Config',
      },
    ],
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Target ||
  mongoose.model<ITarget>('Target', TargetSchema)) as Model<ITarget>;
