import mongoose, { Schema } from 'mongoose';

export const ReviewerSchema = new Schema({
  uniqueIdentifier: {
    type: String,
    unique: true,
    required: true,
  },
  meta: {
    type: Object,
    required: true
  }
});

export default mongoose.models.Reviewer || mongoose.model('Reviewer', ReviewerSchema);
