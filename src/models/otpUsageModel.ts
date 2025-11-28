import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface IOtpusage extends Document {
  user: ObjectId;
  otpName: string;
  queriedAt: Date;
  loginConfirmed: boolean;
}
const otpUsageSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employees',
    },
    otpName: {
      type: String,
    },
    queriedAt: {
      type: Date,
      default: Date.now,
    },
    loginConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOtpusage>('otpUsage', otpUsageSchema);
