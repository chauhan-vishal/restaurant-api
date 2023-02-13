const mongoose = require("mongoose")

const customerSchema = mongoose.Schema({
    name: { type: Array, required: true },
    email: String,
    contact: String,
    gender:String,
    dates: Array,    
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

const Customer = mongoose.model("Csutomer", customerSchema )

module.exports = Customer