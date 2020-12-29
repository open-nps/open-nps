import mongoose, { Schema, Document } from 'mongoose';
import { ThemeOptions } from '@material-ui/core';

type KeyTypes = 'mui' | 'theme' | 'templates';

export interface IConfig extends Document {
  key: KeyTypes;
  values: ThemeOptionsConfigValues | ThemeOptions | TemplatesConfigValues
}

export const ConfigSchema = new Schema({
  key: {
    type: String,
    enum: ['theme', 'templates'],
    required: true,
  },
  values: {
    type: Object,
    required: true,
    default: {}
  }
});

export default mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema)