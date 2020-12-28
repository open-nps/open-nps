import mongoose, { Schema } from 'mongoose';

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

export default mongoose.models.Target || mongoose.model('Target', TargetSchema)
