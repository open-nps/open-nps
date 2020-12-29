import mongoose, { Schema, Document } from 'mongoose';
import timestamp from 'mongoose-timestamp';
import { ThemeOptions } from '@material-ui/core';

type KeyTypes = 'mui' | 'theme' | 'templates';

export interface IConfig extends Document {
  key: KeyTypes;
  values: ThemeOptionsConfigValues | ThemeOptions | TemplatesConfigValues
}

export const ConfigSchema = new Schema({
  key: {
    type: String,
    enum: ['themeOpts', 'mui', 'templates'],
    required: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true
  },
  values: {
    type: Object,
    required: true,
    default: {}
  }
});

ConfigSchema.plugin(timestamp);

export default mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema)
