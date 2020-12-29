import mongoose, { Schema, Document } from 'mongoose';
import { IConfig } from './Config';

import timestamp from 'mongoose-timestamp';

export interface ITarget extends Document {
  name: string;
  configs: string[] | IConfig[];
  meta: any
}

export const TargetSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: 1
  },
  meta: {
    type: Object,
    default: {},
  },
  configs: [{
    type: Schema.Types.ObjectId,
    ref: 'Config'
  }]
});

TargetSchema.plugin(timestamp);

export default mongoose.models.Target || mongoose.model<ITarget>('Target', TargetSchema)
