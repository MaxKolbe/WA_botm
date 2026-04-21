import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface IBarrednumbers extends Document {
  phoneNumber: string;
}

const BarrednumbersSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
  },
});

export default mongoose.model<IBarrednumbers>(
  'barrednumbers',
  BarrednumbersSchema,
);
