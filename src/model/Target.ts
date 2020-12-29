import mongoose, { Schema, Document } from 'mongoose';
import { IConfig } from './Config';

export interface ITarget extends Document {
  name: string;
  configs: string[] | IConfig[];
}

export const TargetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  configs: [{
    type: Schema.Types.ObjectId,
    ref: 'Config'
  }]
});

export default mongoose.models.Target || mongoose.model<ITarget>('Target', TargetSchema)
