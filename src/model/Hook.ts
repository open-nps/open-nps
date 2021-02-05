import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITarget } from './Target';

export enum HookEvent {
  ON_NEW_SURVEY = 'ON_NEW_SURVEY',
  ON_SUBMIT = 'ON_SUBMIT',
  ON_SUCCESS = 'ON_SUCCESS',
}

export const HookEvents = [
  HookEvent.ON_SUBMIT,
  HookEvent.ON_SUCCESS,
  HookEvent.ON_NEW_SURVEY,
];

export interface IHook extends Document {
  event: HookEvent;
  urls: string[];
  target: string | ITarget;
  createdAt: Date;
  updatedAt: Date;
}

interface HookModel extends Model<IHook> {
  findByTargetMappedByEvent(target: string): Record<HookEvent, IHook>;
}

export const HookSchema = new Schema<IHook, HookModel>(
  {
    event: {
      type: String,
      enum: HookEvents,
      index: true,
      required: true,
    },
    urls: [
      {
        type: String,
      },
    ],
    target: {
      type: Schema.Types.ObjectId,
      ref: 'Target',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export function findByTargetMappedByEvent(
  this: HookModel,
  target: string
): Record<HookEvent, IHook> {
  return this.find({ target }).then((hooks) =>
    hooks.reduce((a, c) => ({ ...a, [c.event]: c }), {})
  );
}

HookSchema.static('findByTargetMappedByEvent', findByTargetMappedByEvent);

export default (mongoose.models.Hook ||
  mongoose.model<IHook>('Hook', HookSchema)) as HookModel;
