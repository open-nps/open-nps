import mongoose, { Schema } from 'mongoose';

export const ConfigSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  values: {
    type: Object,
    required: true,
    default: {}
  }
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema)
