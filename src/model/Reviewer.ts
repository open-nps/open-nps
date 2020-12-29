import mongoose, { Schema, Document } from 'mongoose';
import timestamp from 'mongoose-timestamp';

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

ReviewerSchema.plugin(timestamp);

export default mongoose.models.Reviewer || mongoose.model<IReviewer>('Reviewer', ReviewerSchema);
