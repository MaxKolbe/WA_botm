import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  phone: string;
  enabled: boolean;
  attempts: number;
  queried: boolean;
  firsttime: boolean;
  firsttimeResetAt: Date;
  queriedResetAt: Date;
  attemptsResetAt: Date;
  otpLogs: ObjectId;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    queried: {
      type: Boolean,
      default: false,
    },
    firsttime: {
      type: Boolean,
      default: true,
    },
    firsttimeResetAt: {
      type: Date,
      default: null,
    },
    queriedResetAt: {
      type: Date,
      default: null,
    },
    attemptsResetAt: {
      type: Date,
      default: null,
    },
    otpLogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'otpUsage',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IEmployee>('employees', EmployeeSchema);
