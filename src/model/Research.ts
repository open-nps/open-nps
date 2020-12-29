import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { ITarget } from './Target';
import { IReviewer } from './Reviewer';

export interface IResearch extends Document {
  target?: string | ITarget;
  reviewer?: string | IReviewer;
  concluded?: boolean;
  value?: number;
  comment?: string
}

export const ResearchSchema = new Schema({
  target: {
    ref: 'Target',
    type: Schema.Types.ObjectId,
    required: true,
  },
  reviewer: {
    ref: 'Reviewer',
    type: Schema.Types.ObjectId,
    required: true,
  },
  note: {
    type: Number,
    max: 10,
    min: 1,
  },
  concluded: {
    type: Boolean,
    default: false
  },
  comment: {
    type: String
  }
});

export default mongoose.models.Research || mongoose.model<IResearch>('Research', ResearchSchema);

