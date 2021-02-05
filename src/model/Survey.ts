import dateformat from 'dateformat';
import mongoose, { Schema, Document, Model } from 'mongoose';

import { ITarget } from './Target';
import Tag, { ITag } from './Tag';
import { IConfig } from './Config';

import reviewerMetaFile from '../reviewer.json';
import surveyMetaFile from '../survey.json';

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

export const loadFromProcessOrFile = (
  processKey: string,
  file: AnyObject
): AnyObject =>
  process.env[processKey] ? JSON.parse(process.env[processKey]) : file;

const surveyMeta = loadFromProcessOrFile('SURVEY_SCHEMA_JSON', surveyMetaFile);
const reviewerMeta = loadFromProcessOrFile(
  'REVIEWER_SCHEMA_JSON',
  reviewerMetaFile
);

export const SurveySchema = new Schema<ISurvey>(
  {
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
      ...reviewerMeta,
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
  },
  { timestamps: true }
);

export function getOverrideConfigs(): Promise<ITag['overrideConfigs'][]> {
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
