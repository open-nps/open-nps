import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewer extends Document {
  uniqueIdentifier: string;
  meta: any;
}

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

export default mongoose.models.Reviewer || mongoose.model<IReviewer>('Reviewer', ReviewerSchema);
