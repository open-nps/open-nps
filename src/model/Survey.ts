import dateformat from 'dateformat';
import mongoose, { Schema, Document, Model } from 'mongoose';
import timestamp from 'mongoose-timestamp';

import { ITarget } from './Target';
import Tag, { ITag } from './Tag';
import { IConfig } from './Config';

import reviewerJSON from '../reviewer.json';
import surveyMeta from '../survey.json';

export interface ISurvey extends Document {
  target?: string | ITarget;
  reviewer?: AnyObject;
  concluded?: boolean;
  value?: number;
  comment?: string;
  tags: string[];
  tagModelList: ITag[];
  getOverrideConfigs: () => IConfig[][];
  hookFormat: (mod?: AnyObject) => AnyObject;
}

export const SurveySchema = new Schema<ISurvey>({
  target: {
    ref: 'Target',
    type: Schema.Types.ObjectId,
    required: true,
  },
  meta: surveyMeta,
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

export function getOverrideConfigs(): ITag['overrideConfigs'][] {
  return Tag.find({
    name: { $in: this.tags },
  })
    .populate('overrideConfigs')
    .then((tags) => tags.map(({ overrideConfigs }) => overrideConfigs));
}

export function hookFormat(mod = {}): AnyObject {
  return {
    _id: this._id.toString(),
    target: this.target,
    meta: this.meta,
    reviewer: this.reviewer,
    tags: this.tags,
    note: this.note,
    concluded: this.concluded,
    comment: this.comment,
    createdAt: dateformat(this.createdAt, 'yyyy-mm-dd HH:MM:ss'),
    updatedAt: dateformat(this.updatedAt, 'yyyy-mm-dd HH:MM:ss'),
    ...mod,
  };
}

SurveySchema.method('getOverrideConfigs', getOverrideConfigs);
SurveySchema.method('hookFormat', hookFormat);

export default (mongoose.models.Survey ||
  mongoose.model<ISurvey>('Survey', SurveySchema)) as Model<ISurvey>;
