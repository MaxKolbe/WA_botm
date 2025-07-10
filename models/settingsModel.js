import mongoose from 'mongoose'

const settingsSchema = mongoose.Schema({
  botEnabled: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model('settings', settingsSchema)
