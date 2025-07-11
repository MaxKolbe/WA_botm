import mongoose from 'mongoose'

const otpUsageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees'
  },
  otpName: {
    type: String
  },
  queriedAt: {
    type: Date,
    default: Date.now
  },
  loginConfirmed: {
    type: Boolean,
    default: false
  }
},
{
    timestamps: true
})

export default mongoose.model('otpUsage', otpUsageSchema)
