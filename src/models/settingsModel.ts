import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  botEnabled: boolean;
}
const settingsSchema: Schema = new Schema(
  {
    botEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ISettings>('settings', settingsSchema);
