import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  name: string;
  secret: string;
  phrase: string;
  issuer: string;
}
const otpSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    secret: {
      type: String,
    },
    phrase: {
      type: String,
    },
    issuer: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOtp>('otps', otpSchema);
