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
    },
    queried: {
        type: Boolean, 
        default: false   
    }, 
    firsttime: {
        type: Boolean, 
        default: true   
    }
})

export default mongoose.model("employees", employeeSchema)