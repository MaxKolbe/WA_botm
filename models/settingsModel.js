import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  botEnabled: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model('settings', settingsSchema)
