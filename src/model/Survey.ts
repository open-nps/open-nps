import mongoose, { Schema, Document, Model } from 'mongoose';
import timestamp from 'mongoose-timestamp';

import { ITarget } from './Target';
import reviewerJSON from '~/reviewer.json';
import Tag, { ITag } from './Tag';
import { IConfig } from './Config';

export interface ISurvey extends Document {
  target?: string | ITarget;
  reviewer?: AnyObject;
  concluded?: boolean;
  value?: number;
  comment?: string;
  tags: string[];
  tagModelList: ITag[];
  getOverrideConfigs: () => IConfig[][];
}

export const SurveySchema = new Schema({
  target: {
    ref: 'Target',
    type: Schema.Types.ObjectId,
    required: true,
  },
  reviewer: {
    id: {
      type: String,
      required: true,
    },
    ...reviewerJSON,
  },
  tags: [
    {
      type: String,
      index: true,
      // ref: 'Tag'
    },
  ],
  note: {
    type: Number,
    max: 10,
    min: 1,
  },
  concluded: {
    type: Boolean,
    default: false,
    index: true,
  },
  comment: {
    type: String,
  },
});

SurveySchema.plugin(timestamp);

export function getOverrideConfigs() {
  return Tag.find({
    name: { $in: this.tags },
  })
    .populate('overrideConfigs')
    .then((tags) => tags.map(({ overrideConfigs }) => overrideConfigs));
}

SurveySchema.method('getOverrideConfigs', getOverrideConfigs);

export default (mongoose.models.Survey ||
  mongoose.model<ISurvey>('Survey', SurveySchema)) as Model<ISurvey>;
