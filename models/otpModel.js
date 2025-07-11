import mongoose from "mongoose"

const otpSchema = mongoose.Schema({
    name: {
        type: String
    },
    secret: {
        type: String
    },
    phrase: {
        type: String
    },
    issuer: {
        type: String
    }
},
{
    timestamps: true
})

export default mongoose.model("otps", otpSchema)