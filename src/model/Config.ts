import mongoose, { Schema, Document, Model } from 'mongoose';
import timestamp from 'mongoose-timestamp';
import { ThemeOptions } from '@material-ui/core';

export const keyTypes = ['mui', 'theme', 'templates'] as const;
type KeyTypes = typeof keyTypes[number];

export interface IConfig extends Document {
  key: KeyTypes;
  values: ThemeOptionsConfigValues | ThemeOptions | TemplatesConfigValues;
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
    unique: true,
  },
  values: {
    type: Object,
    required: true,
    default: {},
  },
  deletedAt: {
    type: Date,
  },
});

ConfigSchema.plugin(timestamp);

export default (mongoose.models.Config ||
  mongoose.model<IConfig>('Config', ConfigSchema)) as Model<IConfig>;
