import mongoose from "mongoose"

const employeeSchema = mongoose.Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: true
    },
    attempts: {
        type: Number, 
        default: 0
    }
})

export default mongoose.model("employees", employeeSchema)