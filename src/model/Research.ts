import mongoose, { Schema } from 'mongoose';

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
  value: {
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

export default mongoose.models.Research || mongoose.model('Research', ResearchSchema);

