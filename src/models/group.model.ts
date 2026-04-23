import mongoose, { Document, Schema, ObjectId } from 'mongoose';
import { required } from 'zod/mini';

export interface IGroup extends Document {
  name: string;
  admins: ObjectId[];
  members: ObjectId[];
}

const GroupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IGroup>('groups', GroupSchema);
